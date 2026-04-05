"use server";

import { PrismaClient, Status } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/app/lib/auth.config";

const prisma = new PrismaClient();

export async function sellTicket(formData: FormData) {
    const session = await auth();

    if (!session?.user?.id) {
        return { success: false, error: "Debes estar logueado para vender tickets." };
    }

    const ticketId = formData.get("ticketId") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const number = formData.get("number") as string;

    try {
        await prisma.ticket.update({
            where: { id: ticketId },
            data: {
                status: Status.SOLD,
                buyerName: name,
                buyerPhone: phone,
                soldAt: new Date(),
                userId: session.user.id,
            },
        });

        const fechaSorteo = "25 de Mayo";
        const precio = "$5.000";
        const mensaje = `*¡Hola ${name}!* 🏉%0A%0AConfirmamos tu compra en la rifa del *Club San Fernando*.%0A%0A🎫 *Número:* ${number}%0A💰 *Precio:* ${precio}%0A📅 *Fecha de compra:* ${new Date().toLocaleDateString()}%0A🏆 *Sorteo:* ${fechaSorteo}%0A%0A¡Muchas gracias por apoyar al club!`;

        const whatsappUrl = `https://wa.me/${phone}?text=${mensaje}`;

        revalidatePath("/dashboard");
        revalidatePath("/");

        return { success: true, whatsappUrl };
    } catch (error) {
        console.error("Error al vender ticket:", error);
        return { success: false, error: "No se pudo procesar la venta." };
    }
}

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
            await prisma.ticket.update({
                where: { id: ticketId },
                data: {
                    buyerName: name,
                    buyerPhone: phone,
                },
            });
        }

        revalidatePath("/dashboard");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error al actualizar ticket:", error);
        return { success: false, error: "Error al actualizar el ticket." };
    }
}
