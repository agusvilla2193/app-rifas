"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function sellTicket(formData: FormData) {
    const ticketId = formData.get("ticketId") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const number = formData.get("number") as string;

    // TODO: Aquí deberías obtener el ID del usuario logueado 
    // Por ahora lo dejamos como null o busca un usuario de prueba si no tienes Auth configurado
    const currentUserId = null;

    try {
        // 1. Actualizamos en la DB
        await prisma.ticket.update({
            where: { id: ticketId },
            data: {
                status: "SOLD",
                buyerName: name,
                buyerPhone: phone,
                soldAt: new Date(),
                // Si currentUserId es null, no enviamos nada en seller
                // Si luego le pones un ID real, se conectará automáticamente
                userId: currentUserId || undefined
            },
        });

        // 2. Armamos la plantilla de WhatsApp
        const fechaSorteo = "25 de Mayo";
        const precio = "$5.000";
        const mensaje = `*¡Hola ${name}!* 🏉%0A%0AConfirmamos tu compra en la rifa del *Club San Fernando*.%0A%0A🎫 *Número:* ${number}%0A💰 *Precio:* ${precio}%0A📅 *Fecha de compra:* ${new Date().toLocaleDateString()}%0A🏆 *Sorteo:* ${fechaSorteo}%0A%0A¡Muchas gracias por apoyar al club!`;

        const whatsappUrl = `https://wa.me/${phone}?text=${mensaje}`;

        revalidatePath("/dashboard");
        revalidatePath("/");

        return { success: true, whatsappUrl: whatsappUrl };

    } catch (error) {
        console.error("Error al vender ticket:", error);
        return { success: false, error: "No se pudo procesar la venta" };
    }
}
