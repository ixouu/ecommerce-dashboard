"use client";

import * as z from "zod";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Category, Color, Image, Product, Size } from "@prisma/client";
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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import Imageupload from "@/components/ui/image-upload";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductsFormProps {
	initialData:
		| (Product & {
				images: Image[];
		  })
		| null;
	categories: Category[];
	sizes: Size[];
	colors: Color[];
}

type ProductsFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
	name: z.string().min(1),
	images: z.object({ url: z.string() }).array(),
	price: z.coerce.number().positive().min(1),
	categoryId: z.string().min(1),
	colorId: z.string().min(1),
	sizeId: z.string().min(1),
	isFeatured: z.boolean().default(false).optional(),
	isArchived: z.boolean().default(false).optional(),
});

const ProductsForm: React.FC<ProductsFormProps> = ({
	initialData,
	categories,
	sizes,
	colors,
}) => {
	// control alert modal
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const params = useParams();
	const router = useRouter();

	const title = initialData ? "Modifier le produit" : "Créer un produit";
	const description = initialData
		? "Modifier le produit"
		: "Ajouter un produit";
	const toastMessage = initialData ? "Produit modifié" : "Produit créé";
	const action = initialData ? "Sauvegarder" : "Créer";

	const form = useForm<ProductsFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData
			? {
					...initialData,
					price: parseFloat(String(initialData?.price)),
			  }
			: {
					name: "",
					images: [],
					price: 0,
					categoryId: "",
					colorId: "",
					isFeatured: false,
					isArchived: false,
			  },
	});

	const onSumbit = async (data: ProductsFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/products/${params.productId}`,
					data
				);
			} else {
				await axios.post(`/api/${params.storeId}/products`, data);
			}
			router.refresh();
			router.push(`/${params.storeId}/products`);
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
				`/api/${params.storeId}/products/${params.productId}`
			);
			router.refresh();
			router.push(`/${params.storeId}/products`);
			toast.success("Produit supprimé");
		} catch (error) {
			toast.error(
				"Une erreur s'est produite lors de la suppression du produit. Veuillez réessayez."
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
					<FormField
						control={form.control}
						name='images'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Images</FormLabel>
								<FormControl>
									<Imageupload
										value={field.value.map(
											(image) => image.url
										)}
										disabled={loading}
										onChange={(url) =>
											field.onChange([
												...field.value,
												{ url },
											])
										}
										onRemove={(url) =>
											field.onChange([
												...field.value.filter(
													(currentImage) =>
														currentImage.url !== url
												),
											])
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
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
											placeholder='Nom du produit'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='price'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Prix</FormLabel>
									<FormControl>
										<Input
											type='number'
											disabled={loading}
											placeholder='9.99'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='categoryId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Catégorie</FormLabel>
									<Select
										disabled={loading}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													defaultValue={field.value}
													placeholder='Sélectionner une catégorie'
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{categories.map((category) => (
												<SelectItem
													key={category.id}
													value={category.id}>
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='sizeId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Taille</FormLabel>
									<Select
										disabled={loading}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													defaultValue={field.value}
													placeholder='Sélectionner une taille'
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{sizes.map((size) => (
												<SelectItem
													key={size.id}
													value={size.id}>
													{size.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='colorId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Couleur</FormLabel>
									<Select
										disabled={loading}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													defaultValue={field.value}
													placeholder='Sélectionner une couleur'
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{colors.map((color) => (
												<SelectItem
													key={color.id}
													value={color.id}>
													{color.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='isFeatured'
							render={({ field }) => (
								<FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className='space-y-1 leading-none'>
										<FormLabel>En vedette</FormLabel>
										<FormDescription>
											Ce produit apparaitra sur la page d&apos;accueil
										</FormDescription>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='isArchived'
							render={({ field }) => (
								<FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className='space-y-1 leading-none'>
										<FormLabel>Archivé</FormLabel>
										<FormDescription>
											Ce produit n&apos;apparaitra pas dans le magasin
										</FormDescription>
									</div>
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

export default ProductsForm;
