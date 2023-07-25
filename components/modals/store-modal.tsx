"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
	name: z.string().min(1, { message: "Le nom du magasin est requis" }),
});

export const StoreModal = () => {
	const storemodal = useStoreModal();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	async function onsubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
	}

	return (
		<Modal
			title='Créer un nouveau magasin'
			description='Ajouter un nouveau magasin pour gérer les produits et catégories'
			isOpen={storemodal.isOpen}
			onClose={storemodal.onClose}
			>
				<div>
					<div className="space-y-4 py-2 pb-4">
						<Form
							{...form}
						>
							<form
								onSubmit={form.handleSubmit(onsubmit)}
							>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Nom</FormLabel>
											<FormControl>
												<Input 
													placeholder="Nom du magasin"
												{...field} 
												/>	
											</FormControl>
											<FormMessage></FormMessage>
										</FormItem>
									)}
								/>
								<div className="pt-6 space-x-2 flex items-center justify-end w-full">
									<Button
										variant={"outline"}
										onClick={storemodal.onClose}
									>
										Annuler
									</Button>
									<Button
										type="submit"
									>
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
