"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CategoryColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
    data: CategoryColumn
}


const CellAction : React.FC<CellActionProps> = ({
    data
}) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);


    const router = useRouter();
    const params = useParams();

    const onCopy = (id : string ) => {
        navigator.clipboard.writeText(id)
        toast.success('Id de la catégorie copié dans le presse-papier')
    }

    
	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(`/api/${params.storeId}/categories/${data.id}`);
			router.refresh();
			toast.success('Catégorie supprimée');
		} catch (error) {
			toast.error(
				"Soyez sûr que cette catégorie ne contient pas de produits avant de la supprimer"
			);
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};


  return (
    <>
    <AlertModal 
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
    />
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                variant="ghost"
                className="h-8 w-8 p-0"
            >
                {/* sr only means screen reader, not visible on client */}
                <span className="sr-only">Open options</span>
                <MoreHorizontal className="w-4 h-4"/>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={
                () => router.push(`/${params.storeId}/categories/${data.id}`)
            }>
                <Edit className="mr-2 h-4 w-4"/>Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCopy(data.id)}>
                <Copy className="mr-2 h-4 w-4"/>Copier l&apos;id
            </DropdownMenuItem>
            <DropdownMenuItem
                onClick={() => setOpen(true)}
            >
                <Trash className="mr-2 h-4 w-4"/>Supprimer
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    </>
  )
}

export default CellAction