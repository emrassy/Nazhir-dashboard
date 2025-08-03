import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    console.log("GET /api/absensi - Fetching data...");
    
    const data = await db.absensi.findMany({ 
      orderBy: { tanggal: 'desc' } 
    });
    
    console.log(`Found ${data.length} records`);
    
    return NextResponse.json({
      success: true,
      data: data
    });
    
  } catch (error) {
    console.error("GET /api/absensi error:", error);
    
    return NextResponse.json(
      { 
        success: false,
        error: "Gagal mengambil data absensi",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("POST /api/absensi - Starting...");
    
    // Parse request body dengan error handling
    let body;
    try {
      body = await req.json();
      console.log("Received body:", body);
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
    
    // Validasi data yang diterima
    const { namaSantri, tanggal, status, catatan } = body;
    
    // Validasi field required
    if (!namaSantri || !tanggal || !status) {
      return NextResponse.json(
        { 
          success: false,
          error: "Field namaSantri, tanggal, dan status harus diisi" 
        },
        { status: 400 }
      );
    }
    
    // Validasi format tanggal
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
    
    // Validasi status
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
    
    // Siapkan data untuk database
    const dataToSave = {
      namaSantri: namaSantri.trim(),
      tanggal: dateObj,
      status: status,
      catatan: catatan?.trim() || null,
      createdAt: new Date()
    };
    
    console.log("Saving to database:", dataToSave);
    
    // Simpan ke database dengan error handling
    let savedData;
    try {
      savedData = await db.absensi.create({ 
        data: dataToSave 
      });
      console.log("Data saved successfully:", savedData);
    } catch (dbError) {
      console.error("Database error:", dbError);
      
      // Handle specific database errors
      if (dbError instanceof Error) {
        if (dbError.message.includes("unique constraint")) {
          return NextResponse.json(
            { 
              success: false,
              error: "Data absensi untuk santri ini pada tanggal tersebut sudah ada" 
            },
            { status: 409 }
          );
        }
        
        if (dbError.message.includes("foreign key constraint")) {
          return NextResponse.json(
            { 
              success: false,
              error: "Data santri tidak ditemukan" 
            },
            { status: 400 }
          );
        }
      }
      
      throw dbError; // Re-throw jika bukan error yang dikenali
    }
    
    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Absensi berhasil ditambahkan",
        data: savedData
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("POST /api/absensi error:", error);
    
    // Detailed error logging
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: "Terjadi kesalahan internal server",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}