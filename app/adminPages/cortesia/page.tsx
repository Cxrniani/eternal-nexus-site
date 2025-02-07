// app/formulario-lote/page.tsx
"use client";

import React from "react";
import FormularioCortesia from "@/components/FormularioCortesia";
import AdminRoute from "@/components/AdminRoute";

const FormularioCortesiaPage = () => {
    return (
        <AdminRoute>
            <FormularioCortesia/>
        </AdminRoute>
    );
};

export default FormularioCortesiaPage;