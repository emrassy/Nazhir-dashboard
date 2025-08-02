import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Construction, Calendar, BookOpen, Users } from "lucide-react"
import BackButton from "./BackButton"

export default function NewHafalanPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="text-center">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 p-4 rounded-full">
              <Construction className="h-12 w-12 text-orange-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Halaman Dalam Pengembangan
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-gray-600 text-lg">
            Fitur <strong>Tambah Hafalan Baru</strong> sedang dalam proses pengembangan
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
              <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-blue-800">Input Surah</h3>
              <p className="text-sm text-blue-600 text-center">Pencatatan hafalan per surah</p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
              <Users className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-semibold text-green-800">Data Santri</h3>
              <p className="text-sm text-green-600 text-center">Manajemen progress santri</p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
              <Calendar className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-semibold text-purple-800">Jadwal Setor</h3>
              <p className="text-sm text-purple-600 text-center">Penjadwalan setoran hafalan</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">
              💡 <strong>Coming Soon:</strong> Form input hafalan, tracking progress, dan laporan hafalan santri
            </p>
          </div>
          
          <BackButton />
        </CardContent>
      </Card>
    </div>
  )
}