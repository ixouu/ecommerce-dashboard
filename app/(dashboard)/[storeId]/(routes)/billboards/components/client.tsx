"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

const BillboardClient = () => {

    const router = useRouter();
    const params = useParams();
  return (
    <>
    <div className="flex items-center justify-between">
        <Heading
                title='Bannières (0)'
                description='Gérez vos bannières pour vos magasins'
        />
        <Button
            onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
            <Plus className="w-4 h-4 mr-2"/>
            Ajouter une bannière
        </Button>
    </div>
    <Separator/>
    </>
  )
}

export default BillboardClient