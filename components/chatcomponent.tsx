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
    api: '/ask-ai/medichatgemini' // API endpoint for the chat service
  });
  return (
    // Step 6: Main chat container with styling
    <div className="flex h-full min-h-[50vh] flex-col gap-4 rounded-xl bg-dark-200 p-4">
      {/* Step 7: Status badge showing if report is added */}
      <Badge
        variant={'outline'}
        className={`text-14-medium absolute right-3 top-1.5 ${
          reportData ? 'bg-green-500 text-white' : 'border-dark-400 bg-dark-400 text-gray-400'
        }`}
      >
        {reportData ? '✓ Report Added' : 'No Report Added'}
      </Badge>

      {/* Step 8: Flexible spacer */}
      <div className="flex-1" />

      {/* Step 9: Display chat messages */}
      <Messages messages={messages} isLoading={isLoading} />

      {/* Step 10: Display relevant information in an accordion if available */}
      {data?.length !== undefined && data.length > 0 && (
        <Accordion type="single" className="text-14-regular rounded-lg bg-dark-300" collapsible>
          <AccordionItem value="item-1" className="border-dark-400">
            <AccordionTrigger className="px-4 hover:bg-dark-400">
              <span className="flex flex-row items-center gap-2 text-gray-200">
                <TextSearch /> Relevant Info
              </span>
            </AccordionTrigger>
            <AccordionContent className="bg-dark-200 px-4 text-gray-400">
              <Markdown text={(data[data.length - 1] as any).retrievals as string} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      {/* Step 11: Chat input form */}
      <form
        className="relative overflow-hidden rounded-lg border border-dark-400 bg-dark-300"
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
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Type your query here..."
          className="text-14-regular min-h-12 resize-none border-0 bg-transparent p-3 text-gray-200 placeholder:text-gray-600 focus-visible:ring-0"
        />
        {/* Step 13: Submit button with loading state */}
        <div className="flex items-center border-t border-dark-400 bg-dark-200 p-3 pt-2">
          <Button
            disabled={isLoading}
            type="submit"
            size="sm"
            className="text-14-medium ml-auto bg-green-500 text-white hover:bg-green-600"
          >
            {isLoading ? 'Analysing...' : '3. Ask'}
            {isLoading ? <Loader2 className="ml-2 size-3.5 animate-spin" /> : <CornerDownLeft className="ml-2 size-3.5" />}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
