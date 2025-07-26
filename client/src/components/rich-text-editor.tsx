import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bold, Italic, List, Link, Code, Eye, Edit } from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    const newContent = 
      content.substring(0, start) + 
      before + selectedText + after + 
      content.substring(end);
    
    onChange(newContent);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 10);
  };

  const formatPreview = (text: string) => {
    return text
      .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mb-3 mt-6">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mb-4 mt-8">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mb-6 mt-8">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/^\* (.+)$/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li class="ml-4">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(?!<[h|l])/gm, '<p class="mb-4">')
      .replace(/(?<!>)$/gm, '</p>');
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "edit" | "preview")}>
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("**", "**")}
                title="Gras"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("*", "*")}
                title="Italique"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("`", "`")}
                title="Code"
              >
                <Code className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("\n* ", "")}
                title="Liste"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("[texte](", ")")}
                title="Lien"
              >
                <Link className="h-4 w-4" />
              </Button>
            </div>

            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <Edit className="h-3 w-3" />
                Édition
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-3 w-3" />
                Aperçu
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="edit" className="p-4 m-0">
            <Textarea
              value={content}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Écrivez votre article ici... Vous pouvez utiliser du Markdown pour le formatage.

Exemples:
# Titre principal
## Sous-titre
**Texte en gras**
*Texte en italique*
`code`
* Élément de liste"
              rows={20}
              className="resize-none border-0 focus-visible:ring-0 font-mono text-sm"
            />
          </TabsContent>

          <TabsContent value="preview" className="p-4 m-0">
            <div className="min-h-[500px] prose prose-lg max-w-none">
              {content ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: formatPreview(content)
                  }}
                />
              ) : (
                <p className="text-gray-500 italic">Aucun contenu à prévisualiser...</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
