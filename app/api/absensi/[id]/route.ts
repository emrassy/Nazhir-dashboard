// app/api/absensi/[id]/route.ts
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Helper function untuk validasi dan parsing ID
function parseAndValidateId(id: string): { success: true; data: number } | { success: false; error: string } {
  if (!id) {
    return { success: false, error: "ID absensi harus disediakan" };
  }

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return { success: false, error: "Format ID tidak valid" };
  }

  return { success: true, data: parsedId };
}

// GET - Mengambil data absensi berdasarkan ID
export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("GET /api/absensi/[id] - Starting...");
    
    const { id } = await params;
    console.log("Requested ID:", id);
    
    // Validasi dan parsing ID
    const idValidation = parseAndValidateId(id);
    if (!idValidation.success) {
      return NextResponse.json(
        { 
          success: false,
          error: idValidation.error
        },
        { status: 400 }
      );
    }

    const absensiId = idValidation.data;
    
    // Cari data di database
    const data = await db.absensi.findUnique({ 
      where: { id: absensiId } 
    });
    
    // Cek apakah data ditemukan
    if (!data) {
      return NextResponse.json(
        { 
          success: false,
          error: "Data absensi tidak ditemukan" 
        },
        { status: 404 }
      );
    }
    
    console.log("Data found:", data);
    
    return NextResponse.json({
      success: true,
      data: data
    });
    
  } catch (error) {
    console.error("GET /api/absensi/[id] error:", error);
    
    return NextResponse.json(
      { 
        success: false,
        error: "Terjadi kesalahan saat mengambil data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// PUT - Update data absensi berdasarkan ID
export async function PUT(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("PUT /api/absensi/[id] - Starting...");
    
    const { id } = await params;
    console.log("Updating ID:", id);
    
    // Validasi dan parsing ID
    const idValidation = parseAndValidateId(id);
    if (!idValidation.success) {
      return NextResponse.json(
        { 
          success: false,
          error: idValidation.error
        },
        { status: 400 }
      );
    }

    const absensiId = idValidation.data;
    
    // Parse request body
    let body;
    try {
      body = await req.json();
      console.log("Update body:", body);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid JSON format" 
        },
        { status: 400 }
      );
    }
    
    // Validasi data update
    const { namaSantri, tanggal, status, catatan } = body;
    
    // Validasi field yang akan diupdate
    if (namaSantri && !namaSantri.trim()) {
      return NextResponse.json(
        { 
          success: false,
          error: "Nama santri tidak boleh kosong" 
        },
        { status: 400 }
      );
    }
    
    if (tanggal) {
      const dateObj = new Date(tanggal);
      if (isNaN(dateObj.getTime())) {
        return NextResponse.json(
          { 
            success: false,
            error: "Format tanggal tidak valid" 
          },
          { status: 400 }
        );
      }
    }
    
    if (status) {
      const validStatus = ['Hadir', 'Izin', 'Sakit', 'Alpha'];
      if (!validStatus.includes(status)) {
        return NextResponse.json(
          { 
            success: false,
            error: "Status harus salah satu dari: " + validStatus.join(", ") 
          },
          { status: 400 }
        );
      }
    }
    
    // Siapkan data untuk update
    const updateData: any = {
      updatedAt: new Date()
    };
    
    if (namaSantri) updateData.namaSantri = namaSantri.trim();
    if (tanggal) updateData.tanggal = new Date(tanggal);
    if (status) updateData.status = status;
    if (catatan !== undefined) updateData.catatan = catatan?.trim() || null;
    
    console.log("Update data:", updateData);
    
    // Update di database
    let updatedData;
    try {
      updatedData = await db.absensi.update({
        where: { id: absensiId },
        data: updateData,
      });
      console.log("Data updated successfully:", updatedData);
    } catch (dbError: any) {
      console.error("Database update error:", dbError);
      
      if (dbError.code === 'P2025') { // Record not found
        return NextResponse.json(
          { 
            success: false,
            error: "Data absensi tidak ditemukan" 
          },
          { status: 404 }
        );
      }
      
      throw dbError;
    }
    
    return NextResponse.json({
      success: true,
      message: "Data absensi berhasil diupdate",
      data: updatedData
    });
    
  } catch (error) {
    console.error("PUT /api/absensi/[id] error:", error);
    
    return NextResponse.json(
      { 
        success: false,
        error: "Terjadi kesalahan saat mengupdate data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// DELETE - Hapus data absensi berdasarkan ID
export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("DELETE /api/absensi/[id] - Starting...");
    
    const { id } = await params;
    console.log("Deleting ID:", id);
    
    // Validasi dan parsing ID
    const idValidation = parseAndValidateId(id);
    if (!idValidation.success) {
      return NextResponse.json(
        { 
          success: false,
          error: idValidation.error
        },
        { status: 400 }
      );
    }

    const absensiId = idValidation.data;
    
    // Cek apakah data ada sebelum dihapus
    const existingData = await db.absensi.findUnique({
      where: { id: absensiId }
    });
    
    if (!existingData) {
      return NextResponse.json(
        { 
          success: false,
          error: "Data absensi tidak ditemukan" 
        },
        { status: 404 }
      );
    }
    
    // Hapus dari database
    try {
      await db.absensi.delete({ 
        where: { id: absensiId } 
      });
      console.log("Data deleted successfully");
    } catch (dbError: any) {
      console.error("Database delete error:", dbError);
      
      if (dbError.code === 'P2025') { // Record not found
        return NextResponse.json(
          { 
            success: false,
            error: "Data absensi tidak ditemukan" 
          },
          { status: 404 }
        );
      }
      
      throw dbError;
    }
    
    return NextResponse.json({
      success: true,
      message: "Data absensi berhasil dihapus"
    });
    
  } catch (error) {
    console.error("DELETE /api/absensi/[id] error:", error);
    
    return NextResponse.json(
      { 
        success: false,
        error: "Terjadi kesalahan saat menghapus data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}