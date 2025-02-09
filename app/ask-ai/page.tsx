'use client';

import {Settings} from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import {useState} from 'react';

import ChatComponent from '@/components/chatcomponent';
import ReportComponent from '@/components/ReportComponent';
import {Button} from '@/components/ui/button';
import {Drawer, DrawerContent, DrawerTrigger} from '@/components/ui/drawer';
import {useToast} from '@/components/ui/use-toast';

const Home = () => {
  // --- Hooks and State Management ---
  const {toast} = useToast();
  const [reportData, setreportData] = useState<string>('');

  // --- Event Handlers ---
  const onReportConfirmation = (data: string) => {
    setreportData(data);
    toast({
      description: 'Updated!'
    });
  };

  return (
    <>
      <Head>
        <title>CarePulse - Ask AI</title>
        <meta name="description" content="Analyze medical reports using Gemini AI" />
      </Head>
      <div className="flex h-screen max-h-screen bg-dark-300">
        <div className="remove-scrollbar container mx-auto">
          <div className="sub-container">
            {/* Header Section */}
            <header className="sticky top-0 z-10 mb-8 flex items-center justify-between border-b border-dark-400 bg-dark-300 py-4">
              <div className="flex items-center gap-2">
                <Image
                  src="/assets/icons/logo-full.svg"
                  height={40}
                  width={160}
                  alt="CarePulse"
                  className="h-10 w-fit"
                />
              </div>
              <div className="flex items-center gap-4">
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Settings className="text-white" />
                      <span className="sr-only">Settings</span>
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="max-h-[80vh]">
                    <ReportComponent onReportConfirmation={onReportConfirmation} />
                  </DrawerContent>
                </Drawer>
              </div>
            </header>

            {/* Main Content Area */}
            <main className="grid flex-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Sidebar for Report Management (Desktop Only) */}
              <div className="hidden flex-col md:flex">
                <ReportComponent onReportConfirmation={onReportConfirmation} />
              </div>
              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <ChatComponent reportData={reportData} />
              </div>
            </main>

            {/* Footer */}
            <div className="text-14-regular mt-8 flex justify-between border-t border-dark-400 py-4">
              <p className="text-gray-400"> 2025 CarePulse</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
