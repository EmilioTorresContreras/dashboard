"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useBreadcrumbStore } from "@/app/stores/breadcrumbStore";
import { Calificacion } from "@/types/calificacion";

//Tabla Ag Grid
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, ICellRendererParams, RowSelectionOptions } from 'ag-grid-community';
import { AllCommunityModule, colorSchemeDarkBlue, colorSchemeLightCold, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import { useTheme } from "next-themes";
import DeleteButton from "./DeleteButton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { useRouter } from "next/navigation";
import GetButton from "./GetButton";

ModuleRegistry.registerModules([
    AllCommunityModule,
]);

export default function TableCalificaciones() {
    const router = useRouter();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [rowToDelete, setRowToDelete] = useState<Calificacion | null>(null);

    const estudiantes = useQuery(api.estudiantes.obtenerEstudiantes);
    const eliminarCalificacion = useMutation(api.calificaciones.eliminarCalificacion);

    const [calificaciones, setCalificaciones] = useState<Calificacion[] | null>(null);
    const [isLoadingCalificaciones, setIsLoadingCalificaciones] = useState(true);
    const [errorCalificaciones, setErrorCalificaciones] = useState<Error | null>(null);

    useEffect(() => {
        async function cargarCalificaciones() {
            try {
                setIsLoadingCalificaciones(true);
                const data = await fetchQuery(api.calificaciones.obtenerCalificacionesConEstudiante);
                const calificacionesConEstudiante = data.map((calificacion) => ({
                    ...calificacion,
                    estudiante: {
                        nombre: estudiantes?.find(e => e._id === calificacion.estudianteId)?.nombre || "Estudiante no encontrado",
                    },
                }));
                setCalificaciones(calificacionesConEstudiante);
                setErrorCalificaciones(null);
            } catch (err) {
                console.error("Error fetching calificaciones:", err);
                setErrorCalificaciones(err as Error);
                setCalificaciones([]);
            } finally {
                setIsLoadingCalificaciones(false);
            }
        }
        cargarCalificaciones();
    }, [estudiantes]);

    const setItems = useBreadcrumbStore(state => state.setItems)

    useEffect(() => {
        setItems([
            { label: 'Escuela Limón', href: '/' },
            { label: 'Calificaciones', href: '/calificaciones', isCurrentPage: true },
        ])
    }, [setItems])

    const handleVerCalificacion = (id: string) => {
        router.push(`/calificaciones/${id}`);
    };

    const handleDelete = async (id: Id<"calificaciones">) => {
        try {
            await eliminarCalificacion({ id });
            toast.success("Calificación eliminada", { description: "La calificación se ha eliminado correctamente" });
        } catch (error) {
            toast.error("Error", { description: "Ocurrió un error al eliminar la calificación" });
            console.error(error);
        }
    };

    const [columnDefs] = useState<ColDef[]>([
        { field: 'materia', headerName: 'Materia', filter: 'agTextColumnFilter', editable: true, flex: 3 },
        { field: 'nota', headerName: 'Nota', filter: 'agNumberColumnFilter', editable: true, flex: 2 },
        { field: 'semestre', headerName: 'Semestre', flex: 2 },
        {
            headerName: 'Estudiante',
            valueGetter: (params) => params.data.estudiante?.nombre || "Estudiante no encontrado", flex: 3
        },
        { field: 'createdAt', headerName: 'Creado', valueFormatter: (params) => new Date(params.value).toLocaleString(), flex: 2 },
        //{ field: 'updatedAt', headerName: 'Actualizado', valueFormatter: (params) => params.value ? new Date(params.value).toLocaleString() : "No actualizado" },
        {
            headerName: 'Eliminar',
            cellRenderer: DeleteButton,
            cellRendererParams: {
                onDeleteClick: (data: Calificacion) => {
                    setRowToDelete(data);
                    setShowConfirmDialog(true);
                }
            } as unknown as ICellRendererParams<Calificacion, unknown, unknown>,
            sortable: false,
            filter: false,
            flex: 1
        },
        {
            headerName: 'Visualizar',
            cellRenderer: GetButton,
            cellRendererParams: {
                onGetClick: (data: Calificacion) => {
                    handleVerCalificacion(data._id)
                }
            } as unknown as ICellRendererParams<Calificacion, unknown, unknown>,
            sortable: false,
            filter: false,
            flex: 1
        }
    ]);

    const performDelete = useCallback(async () => {
        if (!rowToDelete) return;

        try {
            await eliminarCalificacion({ id: rowToDelete._id });
            toast.success("Calificación eliminada", { description: "La calificación se ha eliminado correctamente" });
        } catch (error) {
            toast.error("Error", { description: "Ocurrió un error al eliminar la calificación" });
            console.error(error);
        }

    }, [rowToDelete, eliminarCalificacion]);

    const cancelDelete = useCallback(() => {
        setShowConfirmDialog(false);
        setRowToDelete(null);
    }, []);

    const rowSelection = useMemo(() => {
        return {
            mode: 'multiRow',
        };
    }, []);

    const { theme } = useTheme();
    const [themeTabla, setThemeTabla] = useState(themeQuartz.withPart(colorSchemeLightCold))

    useEffect(() => {
        if (theme === 'dark') {
            setThemeTabla(themeQuartz.withPart(colorSchemeDarkBlue))
        } else if (theme === 'light') {
            setThemeTabla(themeQuartz.withPart(colorSchemeLightCold))
        } else {
            setThemeTabla(themeQuartz.withPart(colorSchemeDarkBlue))
        }
    }, [theme])

    if (isLoadingCalificaciones) {
        return <div className="container mx-auto py-8 text-center">Cargando calificaciones...</div>;
    }

    if (errorCalificaciones) {
        return <div className="container mx-auto py-8 text-center text-red-500">Error al cargar calificaciones: {errorCalificaciones.message}</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Gestión de Calificaciones</h1>

            {/* Tabla de calificaciones */}
            <div className="bg-card rounded-lg shadow overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Estudiante</TableHead>
                            <TableHead>Materia</TableHead>
                            <TableHead>Nota</TableHead>
                            <TableHead>Semestre</TableHead>
                            <TableHead className="text-center">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!calificaciones || (calificaciones).length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-6">
                                    No hay calificaciones registradas
                                </TableCell>
                            </TableRow>
                        ) : (
                            (calificaciones).map((calificacion) => (
                                <TableRow key={calificacion._id}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => handleVerCalificacion(calificacion._id)}
                                >
                                    <TableCell>
                                        {calificacion.estudianteId
                                            ? `${calificacion.estudiante?.nombre}`
                                            : "Estudiante no encontrado"}
                                    </TableCell>
                                    <TableCell>{calificacion.materia}</TableCell>
                                    <TableCell>{calificacion.nota.toFixed(1)}</TableCell>
                                    <TableCell>{calificacion.semestre}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-center">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(calificacion._id)}
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="py-5"></div>
            <div style={{ width: '100%', height: '70vh' }}>
                <AgGridReact
                    theme={themeTabla}
                    rowData={calificaciones || []} // Asegúrate de que no sea null
                    columnDefs={columnDefs}
                    //defaultColDef={defaultColDef}
                    rowSelection={rowSelection as RowSelectionOptions}
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeSelector={[10, 20, 50, 100]}
                />
            </div>
            {/* Diálogo de Confirmación de Shadcn */}
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente
                            la fila seleccionada: **{rowToDelete ? `${rowToDelete.estudiante?.nombre} | ${rowToDelete.materia} | ${rowToDelete.nota}` : ''}**.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={cancelDelete}>Cancelar</AlertDialogCancel>
                        {/* El botón de acción llama a performDelete */}
                        <AlertDialogAction onClick={performDelete}>Continuar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}


