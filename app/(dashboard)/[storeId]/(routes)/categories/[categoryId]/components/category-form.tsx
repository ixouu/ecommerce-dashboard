"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Billboard, Category } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface CategoryFormProps {
	initialData: Category | null;
	billboards: Billboard[];
}

type CategoriesFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
	name: z.string().min(1),
	billboardId: z.string().min(1),
});

const CategoryForm: React.FC<CategoryFormProps> = ({
	initialData,
	billboards,
}) => {
	// control alert modal
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const params = useParams();
	const router = useRouter();

	const title = initialData ? "Modifier la catégorie" : "Créer une catégorie";
	const description = initialData
		? "Modifier la catégorie"
		: "Ajouter une catégorie";
	const toastMessage = initialData ? "catégorie modifiée" : "catégorie créée";
	const action = initialData ? "Sauvegarder" : "Créer";

	const form = useForm<CategoriesFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: "",
			billboardId: "",
		},
	});

	const onSumbit = async (data: CategoriesFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/categories/${params.categoryId}`,
					data
				);
			} else {
				await axios.post(`/api/${params.storeId}/categories`, data);
			}
			router.refresh();
			router.push(`/${params.storeId}/categories`);
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
			await axios.delete(
				`/api/${params.storeId}/categories/${params.categoryId}`
			);
			router.refresh();
			router.push(`/${params.storeId}/categories`);
			toast.success("catégorie supprimée");
		} catch (error) {
			toast.error(
				"Assurrez-vous d'avoir retiré tous les produits de cette catégorie"
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
											placeholder='Nom de la catégorie'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='billboardId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Bannière</FormLabel>
									<Select
										disabled={loading}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													defaultValue={field.value}
													placeholder='Sélectionner une bannière'
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{billboards.map((billboard) => (
												<SelectItem
													key={billboard.id}
													value={billboard.id}>
													{billboard.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
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

export default CategoryForm;
