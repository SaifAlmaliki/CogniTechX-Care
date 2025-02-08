// Step 1: Import necessary dependencies
import {useChat} from 'ai/react';
import {CornerDownLeft, Loader2, TextSearch} from 'lucide-react';
import React from 'react';

// Step 2: Import custom components and UI elements
import Markdown from './markdown';
import Messages from './messages';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from './ui/accordion';
import {Badge} from './ui/badge';
import {Button} from './ui/button';
import {Textarea} from './ui/textarea';

// Step 3: Define component props interface
type Props = {
  reportData?: string; // Optional medical report data
};

// Step 4: Define the ChatComponent
const ChatComponent = ({reportData}: Props) => {
  // Step 5: Initialize chat functionality using useChat hook
  const {messages, input, handleInputChange, handleSubmit, isLoading, data} = useChat({
    api: 'api/medichatgemini' // API endpoint for the chat service
  });
  return (
    // Step 6: Main chat container with styling
    <div className="bg-muted/[0.5] relative flex h-full min-h-[50vh] flex-col gap-4 rounded-xl p-4">
      {/* Step 7: Status badge showing if report is added */}
      <Badge variant={'outline'} className={`absolute right-3 top-1.5 ${reportData && 'bg-[#00B612]'}`}>
        {reportData ? '✓ Report Added' : 'No Report Added'}
      </Badge>

      {/* Step 8: Flexible spacer */}
      <div className="flex-1" />

      {/* Step 9: Display chat messages */}
      <Messages messages={messages} isLoading={isLoading} />

      {/* Step 10: Display relevant information in an accordion if available */}
      {data?.length !== undefined && data.length > 0 && (
        <Accordion type="single" className="text-sm" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger dir="">
              <span className="flex flex-row items-center gap-2">
                <TextSearch /> Relevant Info
              </span>
            </AccordionTrigger>
            <AccordionContent className="whitespace-pre-wrap">
              <Markdown text={(data[data.length - 1] as any).retrievals as string} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      {/* Step 11: Chat input form */}
      <form
        className="bg-background relative overflow-hidden rounded-lg border"
        onSubmit={event => {
          event.preventDefault();
          handleSubmit(event, {
            data: {
              reportData: reportData as string // Include report data with submission
            }
          });
        }}
      >
        {/* Step 12: Text input area */}
        <Textarea value={input} onChange={handleInputChange} placeholder="Type your query here..." className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0" />
        {/* Step 13: Submit button with loading state */}
        <div className="flex items-center p-3 pt-0">
          <Button disabled={isLoading} type="submit" size="sm" className="ml-auto">
            {isLoading ? 'Analysing...' : '3. Ask'}
            {isLoading ? <Loader2 className="size-3.5 animate-spin" /> : <CornerDownLeft className="size-3.5" />}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
