import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { Button } from "@/components/ui/button";
import { Eye } from 'lucide-react';
import { Calificacion } from '@/types/calificacion';

interface GetButtonParams extends ICellRendererParams<Calificacion> {
    onGetClick: (data: Calificacion) => void;
}

export default function GetButton(props: GetButtonParams) {
    const handleGet = () => {
        if (props.data) {
            props.onGetClick(props.data);
        }
    };

    return (
        <div className="h-full flex">
            <Button
                className='cursor-pointer'
                size="sm"
                onClick={handleGet}
            >
                <Eye />
            </Button>
        </div>
    );
}
