"use client";

import * as z from "zod";
import { use, useState } from "react";
import { Store } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import ApiAlert from "@/components/ui/api-alert";

interface SettingsFormProps {
	initialData: Store;
}

type SettingsFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  name : z.string().min(1)
});


const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  
  // control alert modal
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const router = useRouter();
  
  const form = useForm<SettingsFormValues>({
    resolver : zodResolver(formSchema),
    defaultValues : initialData
  });

  const onSumbit = async(data: SettingsFormValues) => {
    try{
      setLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      toast.success("Magasin mis à jour");
    }catch(error){
      toast.error("Something went wrong")
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async() => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push("/");
      toast.success("Magasin supprimé");
    }catch(error){
      toast.error("Supprimer tous les produits et catégories avant de supprimer le magasin")
    }finally{
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
					title='Reglages'
					description='Gérer les paramètres de votre boutique'
				/>
				<Button
					variant='destructive'
					size='icon'
          disabled={loading}
					onClick={() => {
            setOpen(true);
          }}>
					<Trash className='w-4 h-4'/>
				</Button>
			</div>
      <Separator />
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSumbit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Nom de la boutique"
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
            type="submit"
          >
            Enregistrer les changements
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/stores/${params.storeId}`}
        variant="public"
      />
		</>
	);
};

export default SettingsForm;
