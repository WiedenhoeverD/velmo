import { SiteHeader } from '@/components/dashboard/SiteHeader'
import Accounts from '@/components/accounts/Accounts'

export default function AccountsPage() {
    return (
        <>
            <SiteHeader title="Accounts" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <div className="px-4 lg:px-6">
                            <Accounts />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
