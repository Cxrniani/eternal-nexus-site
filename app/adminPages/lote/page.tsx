// app/formulario-lote/page.tsx
"use client";

import React from "react";
import FormularioLote from "@/components/FormularioLote";
import AdminRoute from "@/components/AdminRoute";

const FormularioLotePage = () => {
    return (
        <AdminRoute>
            <FormularioLote/>
        </AdminRoute>
    );
};

export default FormularioLotePage;