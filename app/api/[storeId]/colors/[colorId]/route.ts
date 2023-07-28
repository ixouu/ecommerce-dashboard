import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function GET(
	req: Request,
	{ params }: { params: { colorId: string } }
) {
	try {

		if (!params.colorId) {
			return new NextResponse("Color ID is required", {
				status: 400,
			});
		}
        
		const { colorId } = params;

		const color = await prismadb.size.findUnique({
			where: {
				id: colorId,
			},
		});

		return NextResponse.json(color);
	} catch (error) {
		console.log("[COLOR_GET]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; colorId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();
		
		const { name, value } = body;

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		if (!name) {
			return new NextResponse("Name is required", { status: 400 });
		}

		if (!value) {
			return new NextResponse("Value is required", { status: 400 });
		}

		if (!params.colorId) {
			return new NextResponse("Color ID is required", {
				status: 400,
			});
		}

		// checck if the user is trying to update someone else's store
		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const { colorId, storeId } = params;

		const color = await prismadb.color.updateMany({
			where: {
				id: colorId,
			},
			data: {
				name,
				value,
			},
		});

		return NextResponse.json(color);
	} catch (error) {
		console.log("[COLOR_PATCH]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { colorId: string; storeId: string } }
) {
	try {
		const { userId } = auth();
        const { colorId, storeId } = params;

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!params.colorId) {
			return new NextResponse("Color ID is required", {
				status: 400,
			});
		}

		// checck if the user is trying to update someone else's store
		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}


		const color = await prismadb.color.deleteMany({
			where: {
				id: colorId,
			},
		});

		return NextResponse.json(color);
	} catch (error) {
		console.log("[COLOR_DELETE]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}