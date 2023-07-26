"use client";

import { useState } from "react";
import axios from "axios";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const formSchema = z.object({
	name: z.string().min(1, { message: "Le nom du magasin est requis" }),
});

export const StoreModal = () => {
	const storemodal = useStoreModal();

	const [loading, setLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	async function onsubmit(values: z.infer<typeof formSchema>) {
		try {
			setLoading(true);
			const reponse = await axios.post("/api/stores", values);
			toast.success("Magasin créé avec succès");
		} catch (error) {
			toast.error("Something went wrong")
		} finally {
			setLoading(false);
		}
	}

	return (
		<Modal
			title='Créer un nouveau magasin'
			description='Ajouter un nouveau magasin pour gérer les produits et catégories'
			isOpen={storemodal.isOpen}
			onClose={storemodal.onClose}>
			<div>
				<div className='space-y-4 py-2 pb-4'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onsubmit)}>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nom</FormLabel>
										<FormControl>
											<Input
												disabled={loading}
												placeholder='Nom du magasin'
												{...field}
											/>
										</FormControl>
										<FormMessage></FormMessage>
									</FormItem>
								)}
							/>
							<div className='pt-6 space-x-2 flex items-center justify-end w-full'>
								<Button
									variant={"outline"}
									disabled={loading}
									onClick={storemodal.onClose}>
									Annuler
								</Button>
								<Button
									disabled={loading}
									type='submit'>
									Continuer
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</Modal>
	);
};
