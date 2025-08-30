'use client'
import { useAccountsAll } from '@/api/account/account'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../ui/table'
import AllAccount from './AllAccount'

export function AllAccounts() {
    const { data: accounts, isLoading } = useAccountsAll()
    if (isLoading) return <div>Loading...</div>

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>IBAN</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="text-right">Delete</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {accounts?.map((account) => (
                    <AllAccount key={account.id} account={account} />
                ))}
            </TableBody>
        </Table>
    )
}
