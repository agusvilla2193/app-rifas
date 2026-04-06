"use server";

import { PrismaClient, Status } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/app/lib/auth.config";

const prisma = new PrismaClient();

/**
 * Procesa la venta de un ticket, asigna el vendedor actual
 * y genera el link de WhatsApp para el comprador.
 */
export async function sellTicket(formData: FormData) {
    const session = await auth();

    // Verificación de seguridad: solo usuarios autenticados venden
    if (!session?.user?.id) {
        return {
            success: false,
            error: "Debes estar logueado para vender tickets."
        };
    }

    const ticketId = formData.get("ticketId") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const number = formData.get("number") as string;

    // Obtenemos el nombre del vendedor desde la sesión de Auth
    const sellerName = session.user.name || "Representante del Club";

    try {
        // 1. Actualizamos el ticket en la base de datos
        await prisma.ticket.update({
            where: { id: ticketId },
            data: {
                status: Status.SOLD,
                buyerName: name,
                buyerPhone: phone,
                soldAt: new Date(),
                userId: session.user.id, // Relacionamos la venta con el usuario logueado
            },
        });

        // 2. Configuramos los datos del sorteo (podes editarlos acá)
        const fechaSorteo = "25 de Mayo";
        const precio = "$5.000";

        // 3. Construimos el mensaje de WhatsApp con formato profesional
        // %0A representa un salto de línea en la URL
        const mensaje = `*¡Hola ${name}!* 🏉%0A%0A` +
            `Confirmamos tu compra en la rifa del *Club San Fernando*.%0A%0A` +
            `🎫 *Número:* ${number}%0A` +
            `💰 *Precio:* ${precio}%0A` +
            `📅 *Fecha de compra:* ${new Date().toLocaleDateString()}%0A` +
            `🏆 *Sorteo:* ${fechaSorteo}%0A%0A` +
            `👤 *Vendedor:* ${sellerName}%0A%0A` +
            `¡Muchas gracias por apoyar al club!`;

        const whatsappUrl = `https://wa.me/${phone}?text=${mensaje}`;

        // 4. Refrescamos el caché de las páginas para mostrar los cambios
        revalidatePath("/dashboard");
        revalidatePath("/");

        return { success: true, whatsappUrl };
    } catch (error) {
        console.error("Error al vender ticket:", error);
        return { success: false, error: "No se pudo procesar la venta." };
    }
}

/**
 * Permite al administrador editar los datos de un comprador
 * o liberar un número (anular la venta).
 */
export async function updateTicket(formData: FormData) {
    const session = await auth();

    if (!session?.user?.id) {
        return { success: false, error: "No autorizado." };
    }

    const ticketId = formData.get("ticketId") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const action = formData.get("action") as string; // "UPDATE" o "RELEASE"

    try {
        if (action === "RELEASE") {
            // Opción: Anular venta y volver a poner disponible
            await prisma.ticket.update({
                where: { id: ticketId },
                data: {
                    status: Status.AVAILABLE,
                    buyerName: null,
                    buyerPhone: null,
                    soldAt: null,
                    userId: null,
                },
            });
        } else {
            // Opción: Solo corregir datos del comprador
            await prisma.ticket.update({
                where: { id: ticketId },
                data: {
                    buyerName: name,
                    buyerPhone: phone,
                },
            });
        }

        // Refrescamos ambas vistas
        revalidatePath("/dashboard");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Error al actualizar ticket:", error);
        return { success: false, error: "Error al actualizar el ticket." };
    }
}
