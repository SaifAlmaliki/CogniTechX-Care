'use client';

import {Settings} from 'lucide-react';
import {useState} from 'react';

import ChatComponent from '@/components/chatcomponent';
import {ModeToggle} from '@/components/modetoggle';
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
    <div className="grid h-screen w-full">
      <div className="flex flex-col">
        {/* Step 1: Header Section */}
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-white px-4 dark:bg-dark-300">
          {/* Branding */}
          <h1 className="text-xl font-semibold text-[#D90013]">
            <span className="flex flex-row">CognitechX Care</span>
          </h1>

          {/* Header Controls */}
          <div className="flex w-full flex-row justify-end gap-2">
            <ModeToggle />
            {/* Mobile Drawer for Settings */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Settings />
                  <span className="sr-only">Settings</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[80vh]">
                <ReportComponent onReportConfirmation={onReportConfirmation} />
              </DrawerContent>
            </Drawer>
          </div>
        </header>

        {/* Step 2: Main Content Area */}
        <main
          className="grid flex-1 gap-4 overflow-auto p-4
          md:grid-cols-2
          lg:grid-cols-3"
        >
          {/* Step 2.1: Sidebar - Report Management (Desktop Only) */}
          <div className="hidden flex-col md:flex">
            <ReportComponent onReportConfirmation={onReportConfirmation} />
          </div>

          {/* Step 2.2: Chat Interface */}
          <div className="lg:col-span-2">
            <ChatComponent reportData={reportData} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
