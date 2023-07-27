"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import  ApiList  from "@/components/ui/api-list";

interface CategoryClientProps {
  data: CategoryColumn[];
}

const CategoryClient : React.FC<CategoryClientProps> = ({
  data
}) => {

    const router = useRouter();
    const params = useParams();

  return (
    <>
    <div className="flex items-center justify-between">
        <Heading
                title={`Catégories (${data.length})`}
                description='Gérez vos catégories pour vos magasins'
        />
        <Button
            onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
            <Plus className="w-4 h-4 mr-2"/>
            Ajouter une catégorie
        </Button>
    </div>
    <Separator/>
    <DataTable 
      columns={columns}
      data={data}
      searchKey="name"
    />
    <Heading title="API" description="API pour les catégories" />
    <Separator />
    <ApiList 
      entityName="categories"
      entityIdName="categoryId"
    />
    </>
  )
}

export default CategoryClient