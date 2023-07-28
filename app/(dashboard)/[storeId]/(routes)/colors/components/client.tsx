"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ColorColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import  ApiList  from "@/components/ui/api-list";

interface ColorClientProps {
  data: ColorColumn[];
}

const ColorClient : React.FC<ColorClientProps> = ({
  data
}) => {

    const router = useRouter();
    const params = useParams();

  return (
    <>
    <div className="flex items-center justify-between">
        <Heading
                title={`Couleurs (${data.length})`}
                description='Gérez vos couleurs pour vos produits'
        />
        <Button
            onClick={() => router.push(`/${params.storeId}/colors/new`)}
        >
            <Plus className="w-4 h-4 mr-2"/>
            Ajouter une couleur
        </Button>
    </div>
    <Separator/>
    <DataTable 
      columns={columns}
      data={data}
      searchKey="label"
    />
    <Heading title="API" description="API pour les couleurs" />
    <Separator />
    <ApiList 
      entityName="colors"
      entityIdName="colorId"
    />
    </>
  )
}

export default ColorClient