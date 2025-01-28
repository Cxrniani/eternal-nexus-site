import { stripe } from "@/utils/stripe";
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const { priceID,quantity } = await request.json();
        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceID,
                    quantity: quantity,
                },
            ],
            mode: 'payment',
            return_url: `${request.headers.get('origin')}/return?session_id={CHECKOUT_SESSION_ID}`,
        });
        return NextResponse.json({ id: session.id, client_secret: session.client_secret });
    }
    catch (error: any) {
        console.error(error);
         return NextResponse.json({ error: { message: error.message } }, { status: 500 });
    }
} 
