import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		// Using clerck to identify the user
		const { userId } = auth();
		const body = await req.json();

		const { name, billboardId } = body;

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		if (!name) {
			return new NextResponse("name is required", { status: 400 });
		}
		if (!billboardId) {
			return new NextResponse("billboard ID is required", { status: 400 });
		}
		if (!params.storeId) {
			return new NextResponse("store ID is required", { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		// create a new store
		const category = await prismadb.category.create({
			data: {
				name,
				billboardId,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(category);
	} catch (error) {
		console.log("[CATEGORY_POST]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const categories = await prismadb.category.findMany({
			where: {
				storeId: params.storeId,
			},
		});

		return NextResponse.json(categories);
	} catch (error) {
		console.log("[CATEGORY_GET]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
