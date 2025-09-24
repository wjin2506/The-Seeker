import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { FileText, Users, Calculator, Handshake } from 'lucide-react';
import { motion } from 'motion/react';

interface MainSelectionProps {
  onNavigate: (page: 'quote-analysis' | 'partner-service') => void;
}

export default function MainSelection({ onNavigate }: MainSelectionProps) {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-4">
            <motion.span 
              className="block text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 leading-tight"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              고객 결정의 기준을 세우는
            </motion.span>
            <motion.span 
              className="block text-2xl md:text-3xl lg:text-4xl text-foreground/80 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            >
              The Seeker
            </motion.span>
          </div>
          <motion.p 
            className="text-muted-foreground text-lg md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            최적의 견적, 최고의 파트너를 찾아드립니다.
          </motion.p>
        </div>

        {/* Service Selection Cards */}
        <motion.div 
          className="grid md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          {/* Quote Analysis Card */}
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Calculator className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-xl md:text-2xl">견적 분석</CardTitle>
              <CardDescription className="text-base">
                견적의 확실성을 보장합니다. 가격 변동은 최대 5%까지만, 그 이상은 The Seeker가 책임집니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <span>견적서 AI 분석</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calculator className="w-5 h-5 text-muted-foreground" />
                  <span>숨겨진 비용 찾기</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <span>상세 분석 리포트</span>
                </div>
              </div>
              <Button 
                className="w-full bg-[rgba(238,157,43,1)] font-bold" 
                size="lg"
                onClick={() => onNavigate('quote-analysis')}
              >
                견적 분석 시작하기
              </Button>
            </CardContent>
          </Card>

          {/* Partner Service Card */}
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Handshake className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-xl md:text-2xl">협력사 매칭 서비스</CardTitle>
              <CardDescription className="text-base">
                검증된 협력사와 매칭하여 스트레스 없는 안전한 시공을 진행하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span>검증된 협력사 매칭</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <span>투명한 견적, 초과금 없는 계약</span>
                </div>
                <div className="flex items-center gap-3">
                  <Handshake className="w-5 h-5 text-muted-foreground" />
                  <span>법적 A/S와 담보된 이행보증금</span>
                </div>
              </div>
              <Button 
                className="w-full" 
                size="lg"
                variant="outline"
                onClick={() => onNavigate('partner-service')}
              >
                협력사 서비스 요청하기
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Info */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
        >
          <p className="text-muted-foreground">
            궁금한 점이 있으시면 언제든지 문의해 주세요.<br /> 전문 상담원이 도움을 드리겠습니다.<br />
            cs@theseeker.co.kr
          </p>
        </motion.div>
      </div>
    </div>
  );
}