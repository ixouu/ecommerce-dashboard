"use client";

import * as z from "zod";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Billboard } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useOrigin } from "@/hooks/use-origin";
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
import Imageupload from "@/components/ui/image-upload";

interface BillboardsFormProps {
	initialData: Billboard | null;
}

type BillboardsFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
	label: z.string().min(1),
	imageUrl: z.string().min(1),
});

const BillboardsForm: React.FC<BillboardsFormProps> = ({ initialData }) => {
	// control alert modal
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const params = useParams();
	const router = useRouter();
	const origin = useOrigin();

	const title = initialData ? "Modifier la bannière" : "Créer une bannière";
	const description = initialData
		? "Modifier la bannière"
		: "Ajouter une bannière";
	const toastMessage = initialData ? "Bannière modifiée" : "Bannière créée";
	const action = initialData ? "Sauvegarder" : "Créer";

	const form = useForm<BillboardsFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			label: "",
			imageUrl: "",
		},
	});

	const onSumbit = async (data: BillboardsFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
			} else {
			await axios.post(`/api/${params.storeId}/billboards`, data);
			}
			router.refresh();
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
			await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
			router.refresh();
			router.push("/");
			toast.success('Bannière supprimée');
		} catch (error) {
			toast.error(
				"Supprimer les catégories utilisant cette bannière avant de la supprimer"
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
						name='imageUrl'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Image de fond</FormLabel>
								<FormControl>
									<Imageupload
										disabled={loading}
										value={field.value ? [field.value] : []}
										onChange={(url) =>
											field.onChange(url)
										}
										onRemove={() => field.onChange("")}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='grid grid-cols-3 gap-8'>
						<FormField
							control={form.control}
							name='label'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Label</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder='Nom de la bannière'
											{...field}
										/>
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
			<Separator />
		</>
	);
};

export default BillboardsForm;
