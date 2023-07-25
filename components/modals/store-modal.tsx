"use client";

import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";

export const StoreModal = () => {
	const storemodal = useStoreModal();

	return (
		<Modal
			title='Créer un nouveau magasin'
			description='Ajouter un nouveau magasin pour gérer les produits et catégories'
			isOpen={storemodal.isOpen}
			onClose={storemodal.onClose}>
			Future create store form
		</Modal>
	);
};
