/*
<ai_context>
This server component provides the contacts page with all contacts from the database.
Updated with a cleaner design to match the site's overall aesthetic and to ensure full width.
</ai_context>
*/

"use server"

import {
  createContactAction,
  deleteContactAction,
  getContactsAction,
  updateContactAction
} from "@/actions/db/contacts-actions"
import { getProfileByUserIdAction } from "@/actions/db/profiles-actions"
import { ContactList } from "@/app/contacts/_components/contact-list"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function ContactsPage() {
  const { userId } = await auth()

  if (!userId) {
    return redirect("/login")
  }

  const { data: profile } = await getProfileByUserIdAction(userId)

  if (!profile) {
    return redirect("/signup")
  }

  const contacts = await getContactsAction(userId)

  return (
    <div className="w-full">
      <ContactList userId={userId} initialContacts={contacts.data ?? []} />
    </div>
  )
}
