import { loadMercadoPago } from "@mercadopago/sdk-js";

export const initializeMercadoPago = async () => {
    await loadMercadoPago();
    const mercadoPago = new window.MercadoPago('TEST-9bbc8e88-6a0d-48ed-b0a2-35b801ad1a56');
};