'use client'

import { IconTrash } from '@tabler/icons-react'
import { TableCell, TableRow } from '../ui/table'
import { Model } from '@/api/model'
import { useAccountDelete } from '@/api/account/account'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Label } from '../ui/label'

export default function AllAccount(props: { account: Model }) {
    const { account } = props

    const { trigger: deleteAccount } = useAccountDelete(account.id)

    return (
        <TableRow>
            <TableCell className="font-medium">{account.name}</TableCell>
            <TableCell>{account.iban}</TableCell>
            <TableCell>{account.account_type}</TableCell>
            <TableCell className="text-right">{account.balance} €</TableCell>
            <TableCell className="text-right">
                <Dialog>
                    <DialogTrigger>
                        <IconTrash color="red" />
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {`Delete Account "${account.name}"`}
                            </DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this account?
                            </DialogDescription>
                        </DialogHeader>
                        <Label>Name: {account.name}</Label>
                        <Label>IBAN: {account.iban}</Label>
                        <Label>Account Type: {account.account_type}</Label>
                        <Label>Balance: {account.balance} €</Label>
                        <Label className="text-red-500 font-bold">
                            This account and all its transactions will be
                            permanently deleted.
                        </Label>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="button" onClick={deleteAccount}>
                                Delete Account
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </TableCell>
        </TableRow>
    )
}
