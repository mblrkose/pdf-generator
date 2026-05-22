import { useState } from 'react';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FileText, Download, Loader2 } from 'lucide-react';

// Helper function to delay execution (rate limit handling)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function App() {
  const [numPdfs, setNumPdfs] = useState<number>(1);
  const [pagesPerPdf, setPagesPerPdf] = useState<number>(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');

  const fetchFreeAIContent = async (pages: number, docIndex: number, retryCount: number = 0): Promise<{ title: string, content: string }> => {
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      
      if (!apiKey) {
        throw new Error('Groq API key not found. Please set VITE_GROQ_API_KEY in your .env.local file. Get a free key at https://console.groq.com/');
      }

      // Reduce word count for free tier to avoid hitting rate limits
      const wordCount = Math.min(pages * 250, 800); // Reduced from 350 to 250 per page
      const topics = [
        "machine learning in healthcare",
        "sustainable energy systems",
        "cryptocurrency and blockchain",
        "climate change mitigation",
        "artificial intelligence ethics",
        "data privacy regulations",
        "quantum computing applications",
        "renewable energy technologies",
        "cybersecurity in modern enterprises",
        "digital transformation strategies",
        "cloud computing architecture",
        "software development methodologies",
        "network optimization techniques",
        "database management systems",
        "web application security"
      ];
      // Use docIndex to pick different topics for each PDF
      const randomTopic = topics[(docIndex + Math.floor(Math.random() * topics.length)) % topics.length];
      const randomCourse = `COURSE ${Math.floor(Math.random() * 300) + 101}`;

      const prompt = `Write a brief academic essay about "${randomTopic}". 
      The essay should be approximately ${wordCount} words with 3-4 paragraphs.
      Include introduction, body, and conclusion with proper academic tone.
      Use specific examples and be detailed.`;

      // Add delay before making request to respect rate limits
      await delay(2000 + (retryCount * 3000)); // 2 seconds base + 3 seconds per retry

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: Math.min(wordCount + 500, 4096), // Reduced from 28000 to 4096
          top_p: 0.9,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.error?.message || 'Unknown error';
        
        // Handle rate limit with retry
        if (errorMsg.includes('rate') || errorMsg.includes('429') || response.status === 429) {
          if (retryCount < 3) {
            console.log(`Rate limited. Retrying in ${5 + (retryCount * 5)} seconds...`);
            setStatusText(`Rate limited. Retrying in ${5 + (retryCount * 5)} seconds...`);
            await delay(5000 + (retryCount * 5000));
            return fetchFreeAIContent(pages, docIndex, retryCount + 1);
          }
          throw new Error('Rate limit exceeded. Please wait a few minutes before trying again.');
        }
        throw new Error(`Groq API error: ${errorMsg}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';

      // Use ALL generated paragraphs for full page coverage
      const paragraphs = content.split('\n\n').filter((p: string) => p.trim().length > 0);
      const formattedContent = paragraphs.join('\n\n');

      return {
        title: `${randomTopic.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} - ${randomCourse}`,
        content: formattedContent
      };
    } catch (e: any) {
      console.error("Failed to generate AI content", e);
      throw new Error(e.message || 'Failed to generate content from AI API.');
    }
  };

  const generatePDFs = async () => {
    setIsGenerating(true);
    setProgress(0);
    setStatusText('Initializing AI generation...');

    try {
      const zip = new JSZip();

      for (let i = 1; i <= numPdfs; i++) {
        setStatusText(`Generating AI Content for Document ${i}/${numPdfs}...`);
        const { title, content } = await fetchFreeAIContent(pagesPerPdf, i - 1);
        
        const doc = new jsPDF();
        
        // --- SPOOF METADATA to bypass automated checks ---
        doc.setProperties({
            title: title,
            subject: 'Academic Assignment',
            author: 'Student Name',
            keywords: 'essay, assignment, research',
            creator: 'Microsoft® Word for Mac'
        });

        const pageHeight = doc.internal.pageSize.height;
        const margin = 25.4; // 1 inch margin
        const maxLineWidth = doc.internal.pageSize.width - margin * 2;
        
        let cursorY = margin;

        // --- ADD ACADEMIC HEADER ---
        doc.setFont('Times', 'normal');
        doc.setFontSize(12);
        
        const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const randomCourse = `COURSE ${Math.floor(Math.random() * 300) + 101}`;
        const randomID = Math.floor(Math.random() * 900000) + 100000;

        doc.text(`Student ID: ${randomID}`, margin, cursorY);
        cursorY += 7;
        doc.text(randomCourse, margin, cursorY);
        cursorY += 7;
        doc.text(today, margin, cursorY);
        cursorY += 15;
        
        // --- ADD TITLE ---
        doc.setFont('Times', 'bold');
        doc.setFontSize(14);
        const titleLines = doc.splitTextToSize(title, maxLineWidth);
        
        // Center title
        titleLines.forEach((line: string) => {
          const textWidth = doc.getStringUnitWidth(line) * doc.getFontSize() / doc.internal.scaleFactor;
          const textOffset = (doc.internal.pageSize.width - textWidth) / 2;
          doc.text(line, textOffset, cursorY);
          cursorY += 7;
        });

        cursorY += 10;
        
        // --- ADD ESSAY CONTENT ---
        doc.setFont('Times', 'normal');
        doc.setFontSize(12);
        
        // Split by paragraphs first to add spacing
        const paragraphs = content.split('\n').filter((p: string) => p.trim() !== '');
        
        let currentPage = 1;
        
        for (const paragraph of paragraphs) {
           // Indent first line of paragraph (standard academic format)
           const indentedParagraph = '     ' + paragraph;
           const textLines = doc.splitTextToSize(indentedParagraph, maxLineWidth);

           for (let j = 0; j < textLines.length; j++) {
             // Handle pagination
             if (cursorY > pageHeight - margin) {
               currentPage++;
               if (currentPage > pagesPerPdf) break; // Hard stop at requested pages
               
               doc.addPage();
               cursorY = margin;
               
               // Re-add header on new pages (optional, but adds realism)
               doc.setFontSize(10);
               doc.text(`Student ID: ${randomID} - Page ${currentPage}`, doc.internal.pageSize.width - margin - 40, margin / 2);
               doc.setFontSize(12);
             }
             
             doc.text(textLines[j], margin, cursorY);
             cursorY += 6; // Double spacing simulation (1.5x to 2.0x)
           }
           cursorY += 4; // Extra space between paragraphs
           
           if (currentPage > pagesPerPdf) break;
        }
        
        if (numPdfs === 1) {
          doc.save(`Assignment_${randomCourse}_${randomID}.pdf`);
          setProgress(100);
          setStatusText('Download complete!');
        } else {
          setStatusText(`Zipping Document ${i}/${numPdfs}...`);
          const pdfBlob = doc.output('blob');
          zip.file(`Assignment_${randomCourse}_${randomID}_v${i}.pdf`, pdfBlob);
          setProgress(Math.round((i / numPdfs) * 100));
        }
      }

      if (numPdfs > 1) {
        setStatusText('Generating final ZIP file...');
        const zipContent = await zip.generateAsync({ type: 'blob' });
        saveAs(zipContent, `Assignments_Batch_${Date.now()}.zip`);
        setStatusText('All files downloaded successfully!');
      }
      
    } catch (error: any) {
      console.error('Failed to generate PDFs:', error);
      setStatusText(error.message || 'An error occurred during generation.');
    } finally {
      setIsGenerating(false);
      setTimeout(() => {
        setStatusText('');
        setProgress(0);
      }, 5000);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon"><FileText size={18} /></div>
          <span>Bypass Generator</span>
        </div>
        <div className="nav-links">
          <span>Product</span>
          <span>Library</span>
          <span>Tutorials</span>
        </div>
        <div className="nav-actions">
          <button className="btn-outline">English</button>
          <button className="btn-dark">Download &darr;</button>
        </div>
      </nav>

      <main className="hero">
        <div className="hero-content">
          <div className="meta-tags">
            <span>OD / 2026</span>
            <span>VOL. 02</span>
            <span>UNDETECTABLE</span>
          </div>

          <h1 className="headline">
            Generating <span>intelligence</span><br />
            with skills, <span>taste,</span> and code.
          </h1>

          <p className="description">
            The ultimate Course Hero bypass. By utilizing AI and spoofing document metadata (like Microsoft Word signatures), this generator creates 100% unique, plagiarism-free academic PDFs that pass automated filters.
          </p>

          <div className="controls-card">
            <div className="control-group">
            </div>

            <div className="control-group">
              <label className="control-label">Number of PDFs</label>
              <div className="slider-container">
                <input 
                  type="range" 
                  min="1" max="20" 
                  value={numPdfs} 
                  onChange={(e) => setNumPdfs(parseInt(e.target.value))}
                  disabled={isGenerating}
                />
                <span className="slider-value">{numPdfs}</span>
              </div>
            </div>

            <div className="control-group">
              <label className="control-label">Pages per PDF</label>
              <div className="slider-container">
                <input 
                  type="range" 
                  min="1" max="50" 
                  value={pagesPerPdf} 
                  onChange={(e) => setPagesPerPdf(parseInt(e.target.value))}
                  disabled={isGenerating}
                />
                <span className="slider-value">{pagesPerPdf}</span>
              </div>
            </div>

            <button 
              className="btn-primary"
              onClick={generatePDFs}
              disabled={isGenerating}
            >
              {isGenerating ? <Loader2 className="spinner" size={20} /> : <Download size={20} />}
              {isGenerating ? 'Synthesizing...' : 'Generate Documents'}
            </button>

            {statusText && (
              <div className="status-text">
                {statusText} {progress > 0 && numPdfs > 1 ? `(${progress}%)` : ''}
              </div>
            )}
          </div>
        </div>

        <div className="hero-image-container">
          <img src="/collage.png" alt="Vintage Editorial Collage" className="hero-image" />
        </div>
      </main>
    </>
  );
}

export default App;
