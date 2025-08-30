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
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Delete Account</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this account?
                            </DialogDescription>
                        </DialogHeader>
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
