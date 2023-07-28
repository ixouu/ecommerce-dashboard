"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ProductColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import  ApiList  from "@/components/ui/api-list";

interface ProductClientProps {
  data: ProductColumn[];
}

const BillboardClient : React.FC<ProductClientProps> = ({
  data
}) => {

    const router = useRouter();
    const params = useParams();

  return (
    <>
    <div className="flex items-center justify-between">
        <Heading
                title={`Produits (${data.length})`}
                description='Gérez vos produits  pour votre magasin'
        />
        <Button
            onClick={() => router.push(`/${params.storeId}/products/new`)}
        >
            <Plus className="w-4 h-4 mr-2"/>
            Ajouter un produit
        </Button>
    </div>
    <Separator/>
    <DataTable 
      columns={columns}
      data={data}
      searchKey="name"
    />
    <Heading title="API" description="API pour les produits" />
    <Separator />
    <ApiList 
      entityName="products"
      entityIdName="productId"
    />
    </>
  )
}

export default BillboardClient