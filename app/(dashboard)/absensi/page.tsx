"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { getAbsensiList } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { PlusCircle, Search } from "lucide-react";
import { DeleteButton } from "./DeleteButton";

type Absensi = {
  id: number;
  namaSantri: string;
  tanggal: string;
  status: string;
  catatan?: string | null;
};

export default function AbsensiPage() {
  const [absensiList, setAbsensiList] = useState<Absensi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const hasShownSuccessRef = useRef(false);

  const fetchAbsensiList = async () => {
    try {
      setIsLoading(true);
      const data = await getAbsensiList();
      setAbsensiList(data);
    } catch (error) {
      console.error("Error fetching absensi list:", error);
      toast.error("Gagal memuat data absensi", {
        id: `fetch-error-${Date.now()}`,
        duration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAbsensiList();

    // Check for success parameters and show notification
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      
      if (urlParams.get('added') === 'true' && !hasShownSuccessRef.current) {
        hasShownSuccessRef.current = true;
        toast.success("Absensi berhasil ditambahkan", {
          id: `page-success-${Date.now()}`,
          duration: 3000
        });
        
        // Clean URL
        window.history.replaceState({}, '', '/absensi');
      }
      
      if (urlParams.get('updated') === 'true' && !hasShownSuccessRef.current) {
        hasShownSuccessRef.current = true;
        toast.success("Data absensi berhasil diupdate", {
          id: `page-update-${Date.now()}`,
          duration: 3000
        });
        
        // Clean URL
        window.history.replaceState({}, '', '/absensi');
      }
    }
  }, []);

  // Filter data berdasarkan search
  const filteredData = absensiList.filter(item =>
    item.namaSantri.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'Hadir': 'bg-green-100 text-green-800 border-green-200',
      'Izin': 'bg-blue-100 text-blue-800 border-blue-200',
      'Sakit': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Alpha': 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">Memuat data absensi...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Absensi</h1>
        <Link href="/absensi/tambah">
          <Button className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Tambah Absensi
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari nama santri atau status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredData.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? 
              "Tidak ada data yang cocok dengan pencarian" : 
              "Belum ada data absensi. Silakan tambah data absensi pertama."
            }
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Santri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((absensi) => (
                  <tr key={absensi.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {absensi.namaSantri}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(absensi.tanggal).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getStatusBadge(absensi.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="max-w-xs truncate">
                        {absensi.catatan || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <Link href={`/absensi/${absensi.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <DeleteButton 
                          id={absensi.id} 
                          onSuccess={fetchAbsensiList}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
        <div>
          {searchTerm ? (
            <>Menampilkan {filteredData.length} dari {absensiList.length} data</>
          ) : (
            <>Total: {absensiList.length} data absensi</>
          )}
        </div>
        
        {searchTerm && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSearchTerm("")}
            className="text-blue-500 hover:text-blue-700"
          >
            Reset Pencarian
          </Button>
        )}
      </div>
    </div>
  );
}