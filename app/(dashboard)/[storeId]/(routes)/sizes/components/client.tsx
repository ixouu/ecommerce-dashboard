"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { SizeColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import  ApiList  from "@/components/ui/api-list";

interface SizeClientProps {
  data: SizeColumn[];
}

const SizeClient : React.FC<SizeClientProps> = ({
  data
}) => {

    const router = useRouter();
    const params = useParams();

  return (
    <>
    <div className="flex items-center justify-between">
        <Heading
                title={`Tailles(${data.length})`}
                description='Gérez vos taille pour vos produits'
        />
        <Button
            onClick={() => router.push(`/${params.storeId}/sizes/new`)}
        >
            <Plus className="w-4 h-4 mr-2"/>
            Ajouter une taille
        </Button>
    </div>
    <Separator/>
    <DataTable 
      columns={columns}
      data={data}
      searchKey="label"
    />
    <Heading title="API" description="API pour les tailles" />
    <Separator />
    <ApiList 
      entityName="Sizes"
      entityIdName="SizeId"
    />
    </>
  )
}

export default SizeClient