import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Check, Zap, Shield } from 'lucide-react';
import FreeAnalysisForm from './FreeAnalysisForm';
import PaidAnalysisForm from './PaidAnalysisForm';

interface QuoteAnalysisProps {
  onBack: () => void;
}

type AnalysisType = 'selection' | 'free' | 'paid';

export default function QuoteAnalysis({ onBack }: QuoteAnalysisProps) {
  const [analysisType, setAnalysisType] = useState<AnalysisType>('selection');

  if (analysisType === 'free') {
    return <FreeAnalysisForm onBack={() => setAnalysisType('selection')} />;
  }

  if (analysisType === 'paid') {
    return <PaidAnalysisForm onBack={() => setAnalysisType('selection')} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="mb-4 text-3xl md:text-4xl">AI 견적 분석 서비스</h1>
          <p className="text-muted-foreground text-lg">
            원하시는 분석 서비스를 선택하세요
          </p>
        </div>

        {/* Service Type Selection */}
        <div className="grid md:grid-cols-2 gap-8 mb-12 items-stretch">
          {/* Free Analysis */}
          <Card className="relative hover:shadow-lg transition-shadow flex flex-col h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">무료 분석</CardTitle>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  무료
                </div>
              </div>
              <CardDescription>
                기본적인 견적서 AI 분석 서비스
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>기본 견적서 검토</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>견적서 등급 심사</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>간단한 분석 리포트</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>24시간 내 결과 제공</span>
                </div>
              </div>
              <Button 
                className="w-full" 
                onClick={() => setAnalysisType('free')}
              >
                무료 분석 신청하기
              </Button>
            </CardContent>
          </Card>

          {/* Paid Analysis */}
          <Card className="relative hover:shadow-lg transition-shadow border-primary flex flex-col h-full">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm flex items-center gap-1">
                <Zap className="w-4 h-4" />
                추천
              </div>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">책임 분석</CardTitle>
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
                  ₩70,000
                </div>
              </div>
              <CardDescription>
                AI 1차 분석 기반 전문 건축 전문가 2차 검증 분석
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span>전문가 1:1 분석</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span>상세 분석 리포트</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span>협력사 계약 무조건 5% 할인</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span>24시간 내 결과 제공</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>견적서 5% 이상 금액 발생 시 저희가 100% 부담</span>
                </div>
              </div>
              <Button 
                className="w-full" 
                onClick={() => setAnalysisType('paid')}
              >
                책임 분석 신청하기
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Comparison */}
        <Card className="bg-muted/50 bg-[rgba(238,157,43,0.21)]">
          <CardHeader>
            <CardTitle className="font-bold">서비스 특징</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <h3 className="mb-2">정확한 분석</h3>
                <p className="text-muted-foreground text-sm">
                  AI 기반 정확한 정량적 검증과 구조상 발생 가능한 모든 비용 리스크 발굴
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="mb-2">신뢰성</h3>
                <p className="text-muted-foreground text-sm">
                  38만건의 검증된 데이터와 340년 경험 반영된 검토로 신뢰할 수 있는 결과
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="mb-2">비용 안정성</h3>
                <p className="text-muted-foreground text-sm">
                  견적의 정확성, 협력사의 안정성 보증 위해 비용 상한선 5% (책임분석)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}