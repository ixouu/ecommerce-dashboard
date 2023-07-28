"use client";

import * as z from "zod";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Color } from "@prisma/client";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";

interface ColorFormProps {
	initialData: Color | null;
}

type ColorFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
	name: z.string().min(1),
	value: z.string().min(4).regex(/^#/, {
		message: "La valeur doit etre un code hexadécimale valide",
	}),
});

const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
	// control alert modal
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const params = useParams();
	const router = useRouter();

	const title = initialData ? "Modifier la couleur" : "Créer une couleur";
	const description = initialData
		? "Modifier la couleur"
		: "Ajouter une couleur";
	const toastMessage = initialData ? "Couleur modifiée" : "Couleur créée";
	const action = initialData ? "Sauvegarder" : "Créer";

	const form = useForm<ColorFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: "",
			value: "",
		},
	});

	const onSumbit = async (data: ColorFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data);
			} else {
			await axios.post(`/api/${params.storeId}/colors`, data);
			}
			router.refresh();
			router.push(`/${params.storeId}/colors`);
			toast.success(toastMessage);
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
			router.refresh();
			router.push(`/${params.storeId}/colors`);
			toast.success('Couleur supprimée');
		} catch (error) {
			toast.error(
				"Supprimer les catégories utilisant cette couleur avant de la supprimer"
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
			<div className='flex items-center justify-between'>
				<Heading
					title={title}
					description={description}
				/>
				{initialData ? (
					<Button
						variant='destructive'
						size='icon'
						disabled={loading}
						onClick={() => {
							setOpen(true);
						}}>
						<Trash className='w-4 h-4' />
					</Button>
				) : null}
			</div>
			<Separator />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSumbit)}
					className='space-y-8 w-full'>
					<div className='grid grid-cols-3 gap-8'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nom</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder='Nom de la couleur'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='value'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Valeur</FormLabel>
									<FormControl>
										<div className="flex items-center gap-x-4">
										<Input
											disabled={loading}
											placeholder='Valeur de la couleur'
											{...field}
										/>
										<div 
											className="border p-4 rounded-full"
											style={{backgroundColor: field.value}}
										/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<Button
						disabled={loading}
						type='submit'>
						{action}
					</Button>
				</form>
			</Form>
		</>
	);
};

export default ColorForm;
