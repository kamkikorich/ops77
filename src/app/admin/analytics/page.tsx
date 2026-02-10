import { getAllPremises } from '@/app/actions';
import { StatusChart, processStatusData } from '@/components/analytics/StatusChart';
import { StrategyList } from '@/components/analytics/StrategyList';
import { BackButton } from '@/components/ui/BackButton';

export const dynamic = 'force-dynamic'; // Ensure we always fetch fresh data from Sheets

export default async function AnalyticsPage() {
    const premises = await getAllPremises();

    // Process data for charts
    const statusData = processStatusData(premises);

    // Calculate simple stats
    const totalHandler = premises.length;
    const compliantCount = premises.filter(p => p.status_perkeso === 'Sudah Daftar').length;
    const complianceRate = totalHandler > 0 ? (compliantCount / totalHandler) * 100 : 0;

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 p-6">
            <div className="mx-auto w-full max-w-5xl space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between print:hidden">
                    <div>
                        <BackButton href="/" label="Kembali ke Utama" />
                        <h1 className="text-3xl font-bold text-gray-900">Analisis Strategik & Laporan</h1>
                        <p className="text-gray-500">Papan pemuka untuk merancang OPS seterusnya.</p>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 print:hidden">
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-gray-500">Jumlah Premis Dilawat</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">{totalHandler}</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-gray-500">Kadar Pematuhan</p>
                        <p className={`mt-2 text-3xl font-bold ${complianceRate >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {complianceRate.toFixed(1)}%
                        </p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-gray-500">Sasaran Berpotensi</p>
                        <p className="mt-2 text-3xl font-bold text-red-600">
                            {premises.filter(p => p.status_perkeso !== 'Sudah Daftar').length}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Status Chart */}
                    <div className="rounded-lg bg-white p-6 shadow-sm print:break-inside-avoid">
                        <h3 className="mb-4 text-lg font-semibold">Taburan Status Pematuhan</h3>
                        <StatusChart data={statusData} />
                    </div>

                    {/* Actionable Strategy List */}
                    <div className="rounded-lg bg-white p-6 shadow-sm print:shadow-none print:p-0">
                        <StrategyList premises={premises} />
                    </div>
                </div>
            </div>
        </div>
    );
}
