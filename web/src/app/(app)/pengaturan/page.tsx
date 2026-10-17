"use client";

/**
 * Pengaturan — tindakan atas data Anda.
 *
 * Untuk saat ini isinya hal-hal yang memang sudah bisa dilakukan: memuat data
 * contoh, mengosongkan pembukuan, dan menghapus usaha dari perangkat ini.
 * Setiap tindakan yang menghapus memakai konfirmasi, karena tidak bisa dibatalkan.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Database, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useWorkspace } from "@/lib/store";
import { copy } from "@/lib/copy";

export default function PengaturanPage() {
  const router = useRouter();
  const { entries, business, loadDemo, clearAll, reset } = useWorkspace();
  const [busy, setBusy] = useState(false);

  function handleLoadDemo() {
    loadDemo();
    toast.success(copy.pengaturan.demoLoaded);
  }

  function handleClear() {
    clearAll();
    toast.success(copy.pengaturan.cleared);
  }

  function handleReset() {
    setBusy(true);
    reset();
    toast.success(copy.pengaturan.reset);
    router.replace("/");
  }

  return (
    <>
      <PageHeader title={copy.pengaturan.title} subtitle={copy.pengaturan.subtitle} />

      <div className="grid gap-6 lg:max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="size-4 text-primary" />
              {copy.pengaturan.dataTitle}
            </CardTitle>
            <CardDescription>
              {copy.pengaturan.dataBody(business?.name ?? copy.app.name, entries.length)}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">{copy.pengaturan.demoTitle}</p>
                <p className="text-xs text-muted-foreground">{copy.pengaturan.demoBody}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLoadDemo}>
                <RotateCcw className="mr-2 size-4" />
                {copy.common.loadDemo}
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">{copy.pengaturan.clearTitle}</p>
                <p className="text-xs text-muted-foreground">{copy.pengaturan.clearBody}</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" disabled={entries.length === 0}>
                    <Trash2 className="mr-2 size-4" />
                    {copy.pengaturan.clearAction}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{copy.pengaturan.clearConfirmTitle}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {copy.pengaturan.clearConfirmBody}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{copy.common.cancel}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClear}>
                      {copy.pengaturan.clearAction}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-base text-destructive">
              {copy.pengaturan.dangerTitle}
            </CardTitle>
            <CardDescription>{copy.pengaturan.dangerBody}</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={busy}>
                  <Trash2 className="mr-2 size-4" />
                  {copy.pengaturan.resetAction}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{copy.pengaturan.resetConfirmTitle}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {copy.pengaturan.resetConfirmBody}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{copy.common.cancel}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleReset}
                    className="bg-destructive text-white hover:bg-destructive/90"
                  >
                    {copy.pengaturan.resetAction}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
