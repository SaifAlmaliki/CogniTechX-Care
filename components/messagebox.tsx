import React from 'react';

import Markdown from './markdown';
import {Card, CardContent, CardFooter} from './ui/card';

type Props = {
  role: string;
  content: string;
};

const MessageBox = ({role, content}: Props) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 text-sm">
        {/* {content} */}
        <Markdown text={content} />
      </CardContent>
      {role !== 'user' && <CardFooter className="bg-muted/50 text-muted-foreground border-t px-6 py-3 text-xs">Disclaimer: The medical advice and recommendations provided by this application are for informational purposes only and should not replace professional medical diagnosis, treatment, or advice.</CardFooter>}
    </Card>
  );
};

export default MessageBox;
