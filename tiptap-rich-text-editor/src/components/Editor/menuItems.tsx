import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Terminal,
  Table as TableIcon,
  Image as ImageIcon,
  Minus,
  HelpCircle,
  Type,
} from 'lucide-react';

export interface SlashMenuItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  keywords: string[];
  command: (editor: Editor) => void;
}

export const getMenuItems = (): SlashMenuItem[] => [
  {
    title: 'Text',
    description: 'Just start writing with plain text.',
    icon: <Type className="h-4 w-4" />,
    keywords: ['text', 'paragraph', 'p'],
    command: ed => ed.chain().focus().setParagraph().run(),
  },
  {
    title: 'Heading 1',
    description: 'Big section heading.',
    icon: <Heading1 className="h-4 w-4" />,
    keywords: ['h1', 'heading', 'large', 'title'],
    command: ed => ed.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading.',
    icon: <Heading2 className="h-4 w-4" />,
    keywords: ['h2', 'heading', 'medium'],
    command: ed => ed.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: 'Heading 3',
    description: 'Small section heading.',
    icon: <Heading3 className="h-4 w-4" />,
    keywords: ['h3', 'heading', 'small'],
    command: ed => ed.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    title: 'Todo List',
    description: 'Track tasks with a checklist.',
    icon: <CheckSquare className="h-4 w-4" />,
    keywords: ['todo', 'checklist', 'task', 'list'],
    command: ed => ed.chain().focus().toggleTaskList().run(),
  },
  {
    title: 'Bulleted List',
    description: 'Create a simple bulleted list.',
    icon: <List className="h-4 w-4" />,
    keywords: ['bullet', 'list', 'ul'],
    command: ed => ed.chain().focus().toggleBulletList().run(),
  },
  {
    title: 'Numbered List',
    description: 'Create a list with numbering.',
    icon: <ListOrdered className="h-4 w-4" />,
    keywords: ['numbered', 'list', 'ol'],
    command: ed => ed.chain().focus().toggleOrderedList().run(),
  },
  {
    title: 'Quote',
    description: 'Capture a quote.',
    icon: <Quote className="h-4 w-4" />,
    keywords: ['quote', 'blockquote', 'cite'],
    command: ed => ed.chain().focus().toggleBlockquote().run(),
  },
  {
    title: 'Callout',
    description: 'Make writing stand out with an emoji and border box.',
    icon: <HelpCircle className="h-4 w-4" />,
    keywords: ['callout', 'box', 'card', 'highlight', 'info'],
    command: ed => ed.chain().focus().setCallout().run(),
  },
  {
    title: 'Code Block',
    description: 'Write code with syntax highlighting.',
    icon: <Terminal className="h-4 w-4" />,
    keywords: ['code', 'block', 'highlight', 'pre'],
    command: ed => ed.chain().focus().toggleCodeBlock().run(),
  },
  {
    title: 'Table',
    description: 'Insert a grid table.',
    icon: <TableIcon className="h-4 w-4" />,
    keywords: ['table', 'grid', 'matrix'],
    command: ed =>
      ed.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },
  {
    title: 'Image',
    description: 'Insert an image via link.',
    icon: <ImageIcon className="h-4 w-4" />,
    keywords: ['image', 'photo', 'picture', 'url'],
    command: ed => {
      const url = window.prompt('Enter image URL:');
      if (url) {
        ed.chain().focus().setImage({ src: url }).run();
      }
    },
  },
  {
    title: 'Divider',
    description: 'Visually divide blocks with a line.',
    icon: <Minus className="h-4 w-4" />,
    keywords: ['divider', 'hr', 'line', 'separator'],
    command: ed => ed.chain().focus().setHorizontalRule().run(),
  },
];
