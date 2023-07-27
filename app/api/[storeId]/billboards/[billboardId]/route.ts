import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function GET(
	req: Request,
	{ params }: { params: { billboardId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!params.billboardId) {
			return new NextResponse("Billboard ID is required", {
				status: 400,
			});
		}
        
		const { billboardId } = params;

		const billboard = await prismadb.billboard.findUnique({
			where: {
				id: billboardId,
			},
		});

		return NextResponse.json(billboard);
	} catch (error) {
		console.log("[Billboard_GET]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; billboardId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();
		
		const { label, imageUrl } = body;

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		if (!label) {
			return new NextResponse("Label is required", { status: 400 });
		}

		if (!imageUrl) {
			return new NextResponse("Image URL is required", { status: 400 });
		}

		if (!params.billboardId) {
			return new NextResponse("Billboard ID is required", {
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

		const { billboardId, storeId } = params;

		const billboard = await prismadb.billboard.updateMany({
			where: {
				id: billboardId,
			},
			data: {
				label,
				imageUrl,
			},
		});

		return NextResponse.json(billboard);
	} catch (error) {
		console.log("[BILLBOARD_PATCH]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { billboardId: string; storeId: string } }
) {
	try {
		const { userId } = auth();
        const { billboardId, storeId } = params;

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!params.billboardId) {
			return new NextResponse("Billboard ID is required", {
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


		const billboard = await prismadb.billboard.deleteMany({
			where: {
				id: billboardId,
			},
		});

		return NextResponse.json(billboard);
	} catch (error) {
		console.log("[Billboard_DELETE]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}