// components/DeleteButtonRenderer.tsx
import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { Button } from "@/components/ui/button";
import { Trash } from 'lucide-react';
import { Calificacion } from '@/types/calificacion';

interface DeleteButtonParams extends ICellRendererParams<Calificacion> {
    onDeleteClick: (data: Calificacion) => void;
}

export default function DeleteButton(props: DeleteButtonParams) {
    const handleDelete = () => {
        if (props.data) {
            props.onDeleteClick(props.data);
        }
    };

    return (
        <div className="h-full flex">
            <Button
                variant="destructive"
                className="cursor-pointer"
                size="sm"
                onClick={handleDelete}
            >
                <Trash />
            </Button>
        </div>
    );
}