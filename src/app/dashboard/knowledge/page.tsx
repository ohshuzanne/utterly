'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/app/components/layout/Header';
import { Sidebar } from '@/app/components/layout/Sidebar';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface NotionPage {
  id: string;
  title: string;
  description: string;
  lastEditedTime: string;
  url: string;
  coverUrl: string;
}

export default function KnowledgeBasePage() {
  const [pages, setPages] = useState<NotionPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, pagesResponse] = await Promise.all([
          fetch('/api/user'),
          fetch('/api/notion/pages')
        ]);

        if (!userResponse.ok || !pagesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const userData = await userResponse.json();
        const pagesData = await pagesResponse.json();

        setFirstName(userData.firstName || '');
        setPages(pagesData.pages);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      
      <div className="ml-[60px]">
        <Header userName={firstName} />
        
        <main className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Knowledge Base</h1>
              <p className="text-gray-600">
                Explore our collection of articles and guides to help you get the most out of Utterly.
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              </div>
            ) : pages.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-2">No articles available</h3>
                <p className="text-gray-500">Check back later for updates</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map((page) => (
                  <Card 
                    key={page.id} 
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => window.open(page.url, '_blank')}
                  >
                    {page.coverUrl ? (
                      <div className="relative h-48 w-full">
                        <Image
                          src={page.coverUrl}
                          alt={page.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                        <span className="text-4xl font-bold text-purple-300">U.</span>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{page.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{page.description}</p>
                      <div className="text-xs text-gray-500">
                        Last updated: {new Date(page.lastEditedTime).toLocaleDateString()}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 