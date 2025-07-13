import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  List,
  ListOrdered,
  Save,
  FolderOpen,
  Printer,
  Undo2,
  Redo2,
  Search,
  ZoomIn,
  ZoomOut,
  FileText,
  Settings,
  Minimize2,
  Square,
  X
} from 'lucide-react'

function App() {
  const [documentTitle, setDocumentTitle] = useState('Document1')
  const [content, setContent] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [zoom, setZoom] = useState(100)
  const [activeTab, setActiveTab] = useState('home')
  const editorRef = useRef<HTMLDivElement>(null)

  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const text = editorRef.current.innerText
      setContent(text)
      setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length)
    }
  }, [])

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const formatText = (command: string) => {
    executeCommand(command)
  }

  const alignText = (alignment: string) => {
    executeCommand(`justify${alignment}`)
  }

  const insertList = (type: 'insertUnorderedList' | 'insertOrderedList') => {
    executeCommand(type)
  }

  const changeFontSize = (size: string) => {
    executeCommand('fontSize', size)
  }

  const changeFontFamily = (family: string) => {
    executeCommand('fontName', family)
  }

  const saveDocument = () => {
    localStorage.setItem('msword-document', JSON.stringify({
      title: documentTitle,
      content: editorRef.current?.innerHTML || '',
      wordCount
    }))
    alert('Document saved!')
  }

  const openDocument = () => {
    const saved = localStorage.getItem('msword-document')
    if (saved) {
      const doc = JSON.parse(saved)
      setDocumentTitle(doc.title)
      if (editorRef.current) {
        editorRef.current.innerHTML = doc.content
      }
      setWordCount(doc.wordCount)
    }
  }

  const handleZoom = (newZoom: number) => {
    setZoom(Math.max(25, Math.min(200, newZoom)))
  }

  return (
    <div className="min-h-screen bg-[#f3f2f1] flex flex-col document-editor">
      {/* Title Bar */}
      <div className="bg-[#0078d4] text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <FileText className="w-5 h-5" />
          <span className="font-medium">{documentTitle} - Microsoft Word</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-8 w-8 p-0">
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-8 w-8 p-0">
            <Square className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-red-600 h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Access Toolbar */}
      <div className="bg-white border-b px-2 py-1 flex items-center space-x-1">
        <Button variant="ghost" size="sm" onClick={saveDocument} className="format-button h-8">
          <Save className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={openDocument} className="format-button h-8">
          <FolderOpen className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => executeCommand('undo')} className="format-button h-8">
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => executeCommand('redo')} className="format-button h-8">
          <Redo2 className="w-4 h-4" />
        </Button>
        <Separator orientation="vertical" className="h-6 mx-2" />
        <Button variant="ghost" size="sm" className="format-button h-8">
          <Printer className="w-4 h-4" />
        </Button>
      </div>

      {/* Ribbon Interface */}
      <div className="bg-white border-b">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-auto p-0 bg-transparent border-0 rounded-none">
            <TabsTrigger 
              value="home" 
              className="px-4 py-2 rounded-none ribbon-tab data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#0078d4]"
            >
              Home
            </TabsTrigger>
            <TabsTrigger 
              value="insert" 
              className="px-4 py-2 rounded-none ribbon-tab data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#0078d4]"
            >
              Insert
            </TabsTrigger>
            <TabsTrigger 
              value="design" 
              className="px-4 py-2 rounded-none ribbon-tab data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#0078d4]"
            >
              Design
            </TabsTrigger>
            <TabsTrigger 
              value="layout" 
              className="px-4 py-2 rounded-none ribbon-tab data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#0078d4]"
            >
              Layout
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="mt-0 p-4 tab-content">
            <div className="flex items-center space-x-6">
              {/* Font Controls */}
              <div className="flex items-center space-x-2">
                <Select onValueChange={changeFontFamily} defaultValue="Calibri">
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue placeholder="Calibri" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Calibri">Calibri</SelectItem>
                    <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Verdana">Verdana</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={changeFontSize} defaultValue="3">
                  <SelectTrigger className="w-16 h-8">
                    <SelectValue placeholder="11" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">8</SelectItem>
                    <SelectItem value="2">10</SelectItem>
                    <SelectItem value="3">12</SelectItem>
                    <SelectItem value="4">14</SelectItem>
                    <SelectItem value="5">16</SelectItem>
                    <SelectItem value="6">18</SelectItem>
                    <SelectItem value="7">24</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator orientation="vertical" className="h-8" />

              {/* Text Formatting */}
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => formatText('bold')}
                  className="format-button h-8 w-8 p-0"
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => formatText('italic')}
                  className="format-button h-8 w-8 p-0"
                >
                  <Italic className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => formatText('underline')}
                  className="format-button h-8 w-8 p-0"
                >
                  <Underline className="w-4 h-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-8" />

              {/* Text Alignment */}
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => alignText('Left')}
                  className="format-button h-8 w-8 p-0"
                >
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => alignText('Center')}
                  className="format-button h-8 w-8 p-0"
                >
                  <AlignCenter className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => alignText('Right')}
                  className="format-button h-8 w-8 p-0"
                >
                  <AlignRight className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => alignText('Full')}
                  className="format-button h-8 w-8 p-0"
                >
                  <AlignJustify className="w-4 h-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-8" />

              {/* Lists */}
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => insertList('insertUnorderedList')}
                  className="format-button h-8 w-8 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => insertList('insertOrderedList')}
                  className="format-button h-8 w-8 p-0"
                >
                  <ListOrdered className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insert" className="mt-0 p-4 tab-content">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="h-8">Table</Button>
              <Button variant="outline" size="sm" className="h-8">Pictures</Button>
              <Button variant="outline" size="sm" className="h-8">Shapes</Button>
              <Button variant="outline" size="sm" className="h-8">Header</Button>
              <Button variant="outline" size="sm" className="h-8">Footer</Button>
              <Button variant="outline" size="sm" className="h-8">Page Break</Button>
            </div>
          </TabsContent>

          <TabsContent value="design" className="mt-0 p-4 tab-content">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="h-8">Themes</Button>
              <Button variant="outline" size="sm" className="h-8">Colors</Button>
              <Button variant="outline" size="sm" className="h-8">Fonts</Button>
              <Button variant="outline" size="sm" className="h-8">Page Color</Button>
              <Button variant="outline" size="sm" className="h-8">Watermark</Button>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="mt-0 p-4 tab-content">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="h-8">Margins</Button>
              <Button variant="outline" size="sm" className="h-8">Orientation</Button>
              <Button variant="outline" size="sm" className="h-8">Size</Button>
              <Button variant="outline" size="sm" className="h-8">Columns</Button>
              <Button variant="outline" size="sm" className="h-8">Line Numbers</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Ruler */}
      <div className="bg-white border-b px-4 py-1">
        <div className="h-6 bg-gray-50 border relative ruler">
          {/* Ruler markings */}
          {Array.from({ length: 17 }, (_, i) => (
            <div key={i} className="flex flex-col">
              <div
                className="absolute top-0 w-px bg-gray-400 h-2"
                style={{ left: `${i * 6}%` }}
              />
              {i % 2 === 0 && (
                <span 
                  className="absolute top-1 text-xs text-gray-600"
                  style={{ left: `${i * 6}%`, transform: 'translateX(-50%)' }}
                >
                  {i / 2}
                </span>
              )}
            </div>
          ))}
          <div className="absolute top-1 left-4 w-3 h-3 bg-blue-500 cursor-pointer triangle-left" />
          <div className="absolute top-1 right-4 w-3 h-3 bg-blue-500 cursor-pointer triangle-right" />
        </div>
      </div>

      {/* Document Area */}
      <div className="flex-1 p-8 overflow-auto bg-[#f3f2f1]" style={{ zoom: `${zoom}%` }}>
        <div className="max-w-4xl mx-auto">
          {/* Page */}
          <div className="bg-white document-page min-h-[11in] w-[8.5in] mx-auto p-16 relative">
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleContentChange}
              className="min-h-[8in] outline-none text-black leading-relaxed"
              style={{ 
                fontFamily: 'Calibri, sans-serif',
                fontSize: '11pt',
                lineHeight: '1.15'
              }}
              data-placeholder="Type your document here..."
            />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="status-bar text-white px-4 py-1 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-6">
          <span>Page 1 of 1</span>
          <span>Words: {wordCount}</span>
          <span>Characters: {content.length}</span>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-6 text-xs">
            <Search className="w-3 h-3 mr-1" />
            Find
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20 h-6 w-6 p-0"
            onClick={() => handleZoom(zoom - 10)}
          >
            <ZoomOut className="w-3 h-3" />
          </Button>
          <span className="min-w-[3rem] text-center">{zoom}%</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20 h-6 w-6 p-0"
            onClick={() => handleZoom(zoom + 10)}
          >
            <ZoomIn className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default App