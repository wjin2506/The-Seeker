import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { ArrowLeft, Upload, FileText, CheckCircle, X } from 'lucide-react';

interface FreeAnalysisFormProps {
  onBack: () => void;
}

// Helper function to convert file to Base64
const fileToBase64 = (file: File | null): Promise<string> => {
  return new Promise((resolve) => {
    if (!file) {
      resolve('');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.readAsDataURL(file);
  });
};

export default function FreeAnalysisForm({ onBack }: FreeAnalysisFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    constructionArea: '',
    budgetRange: '',
    additionalInfo: ''
  });

  const [files, setFiles] = useState({
    quote: null as File | null,
    blueprint: null as File | null
  });

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to get display text for select values
  const getDisplayText = (value: string, type: 'project' | 'area' | 'budget'): string => {
    const projectTypes: Record<string, string> = {
      'apartment': '신축',
      'house': '리모델링', 
      'office': '인테리어',
      'commercial': '부분 공사 및 수리',
      'industrial': '상업시설 건축',
      'other': '기타'
    };

    const areas: Record<string, string> = {
      'seoul': '서울특별시',
      'busan': '부산광역시',
      'daegu': '대구광역시',
      'incheon': '인천광역시',
      'gwangju': '광주광역시',
      'daejeon': '대전광역시',
      'ulsan': '울산광역시',
      'gyeonggi': '경기도',
      'gangwon': '강원도',
      'chungbuk': '충청북도',
      'chungnam': '충청남도',
      'jeonbuk': '전라북도',
      'jeonnam': '전라남도',
      'gyeongbuk': '경상북도',
      'gyeongnam': '경상남도',
      'jeju': '제주특별자치도'
    };

    const budgets: Record<string, string> = {
      'under-50m': '5천만원 이하',
      '50m-100m': '5천만원 - 1억원',
      '100m-300m': '1억원 - 3억원',
      '300m-500m': '3억원 - 5억원',
      '500m-1b': '5억원 - 10억원',
      'over-1b': '10억원 이상'
    };

    switch (type) {
      case 'project': return projectTypes[value] || value;
      case 'area': return areas[value] || value;
      case 'budget': return budgets[value] || value;
      default: return value;
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!formData.name || !formData.email || !formData.phone || !formData.projectType || !formData.constructionArea || !formData.budgetRange) {
      alert('모든 필수 항목(*)을 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Web3Forms API Key
      const apiKey = import.meta.env.VITE_WEB3FORMS_API_KEY;

      if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        console.warn('Web3Forms API key not configured. Please set VITE_WEB3FORMS_API_KEY in .env file');
        alert('이메일 서비스가 아직 구성되지 않았습니다. 관리자에게 문의해주세요.');
        return;
      }


      // Prepare form data for Web3Forms
      const web3FormData = new FormData();
      web3FormData.append('access_key', apiKey);
      web3FormData.append('subject', `[무료 분석 신청] ${formData.name}님 견적 분석 요청`);
      web3FormData.append('name', formData.name);
      web3FormData.append('email', formData.email);
      web3FormData.append('phone', formData.phone);
      web3FormData.append('project_type', getDisplayText(formData.projectType, 'project'));
      web3FormData.append('construction_area', getDisplayText(formData.constructionArea, 'area'));
      web3FormData.append('budget_range', getDisplayText(formData.budgetRange, 'budget'));
      web3FormData.append('additional_info', formData.additionalInfo || '없음');
      web3FormData.append('신청_일시', new Date().toLocaleString('ko-KR'));

      // Add file attachments (Web3Forms Pro supports up to 25MB)
      if (files.quote) {
        web3FormData.append('견적서_파일명', files.quote.name);
        web3FormData.append('견적서_파일크기', `${Math.round(files.quote.size / 1024)}KB`);
        // Add actual file for Web3Forms Pro
        web3FormData.append('attachment', files.quote, `quote_${files.quote.name}`);
      } else {
        web3FormData.append('견적서_파일', '첨부되지 않음');
      }

      if (files.blueprint) {
        web3FormData.append('도면_파일명', files.blueprint.name);
        web3FormData.append('도면_파일크기', `${Math.round(files.blueprint.size / 1024)}KB`);
        // Add actual file for Web3Forms Pro
        web3FormData.append('attachment', files.blueprint, `blueprint_${files.blueprint.name}`);
      } else {
        web3FormData.append('도면_파일', '첨부되지 않음');
      }

      // Custom message format
      const message = `
새로운 무료 견적 분석 신청이 접수되었습니다.

=== 신청자 정보 ===
이름: ${formData.name}
이메일: ${formData.email}
휴대폰: ${formData.phone}

=== 프로젝트 정보 ===
프로젝트 유형: ${getDisplayText(formData.projectType, 'project')}
시공 지역: ${getDisplayText(formData.constructionArea, 'area')}
예산 범위: ${getDisplayText(formData.budgetRange, 'budget')}

=== 첨부 파일 정보 ===
견적서: ${files.quote ? `${files.quote.name} (${Math.round(files.quote.size / 1024)}KB)` : '첨부되지 않음'}
도면: ${files.blueprint ? `${files.blueprint.name} (${Math.round(files.blueprint.size / 1024)}KB)` : '첨부되지 않음'}

=== 추가 요청사항 ===
${formData.additionalInfo || '없음'}

처리 요청: 24시간 내 분석 결과를 고객 이메일(${formData.email})로 발송 예정
신청 일시: ${new Date().toLocaleString('ko-KR')}
      `.trim();

      web3FormData.append('message', message);

      // Send to Web3Forms
      console.log('Sending to Web3Forms...');
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: web3FormData
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Email sent successfully via Web3Forms');
        // Show success modal after email is sent
        setIsSuccessModalOpen(true);

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          projectType: '',
          constructionArea: '',
          budgetRange: '',
          additionalInfo: ''
        });
        setFiles({
          quote: null,
          blueprint: null
        });
      } else {
        console.error('Web3Forms error:', result);
        alert('죄송합니다. 신청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('죄송합니다. 신청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (type: 'quote' | 'blueprint', file: File | null) => {
    setFiles(prev => ({ ...prev, [type]: file }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="mb-4 text-2xl md:text-3xl">무료 견적 분석 신청</h1>
          <p className="text-muted-foreground">
            정확한 분석을 위해 아래 정보를 입력해 주세요
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>신청자 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">이름 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="홍길동"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">이메일 주소 *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="example@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">휴대폰 번호 *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="010-1234-5678"
                  required
                />
              </div>

              {/* Project Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectType">프로젝트 유형 *</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, projectType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="프로젝트 유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">신축</SelectItem>
                      <SelectItem value="house">리모델링</SelectItem>
                      <SelectItem value="office">인테리어</SelectItem>
                      <SelectItem value="commercial">부분 공사 및 수리</SelectItem>
                      <SelectItem value="industrial">상업시설 건축</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="constructionArea">시공 지역 *</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, constructionArea: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="시공 지역 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seoul">서울특별시</SelectItem>
                      <SelectItem value="busan">부산광역시</SelectItem>
                      <SelectItem value="daegu">대구광역시</SelectItem>
                      <SelectItem value="incheon">인천광역시</SelectItem>
                      <SelectItem value="gwangju">광주광역시</SelectItem>
                      <SelectItem value="daejeon">대전광역시</SelectItem>
                      <SelectItem value="ulsan">울산광역시</SelectItem>
                      <SelectItem value="gyeonggi">경기도</SelectItem>
                      <SelectItem value="gangwon">강원도</SelectItem>
                      <SelectItem value="chungbuk">충청북도</SelectItem>
                      <SelectItem value="chungnam">충청남도</SelectItem>
                      <SelectItem value="jeonbuk">전라북도</SelectItem>
                      <SelectItem value="jeonnam">전라남도</SelectItem>
                      <SelectItem value="gyeongbuk">경상북도</SelectItem>
                      <SelectItem value="gyeongnam">경상남도</SelectItem>
                      <SelectItem value="jeju">제주특별자치도</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="budgetRange">예산 범위 *</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, budgetRange: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="예산 범위 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-50m">5천만원 이하</SelectItem>
                    <SelectItem value="50m-100m">5천만원 - 1억원</SelectItem>
                    <SelectItem value="100m-300m">1억원 - 3억원</SelectItem>
                    <SelectItem value="300m-500m">3억원 - 5억원</SelectItem>
                    <SelectItem value="500m-1b">5억원 - 10억원</SelectItem>
                    <SelectItem value="over-1b">10억원 이상</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* File Uploads */}
              <div className="space-y-4">
                <div>
                  <Label>견적서 파일 업로드</Label>
                  <div className="mt-2">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {files.quote ? files.quote.name : 'PDF, 이미지 파일을 선택하세요'}
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.gif"
                        onChange={(e) => handleFileUpload('quote', e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <Label>도면 파일 업로드</Label>
                  <div className="mt-2">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FileText className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {files.blueprint ? files.blueprint.name : 'PDF, 이미지 파일을 선택하세요.'}
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".dwg,.pdf,.jpg,.jpeg,.png,.gif"
                        onChange={(e) => handleFileUpload('blueprint', e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <Label htmlFor="additionalInfo">추가 요청사항</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                  placeholder="견적서 관련 고객님의 요구사항을 기재해주세요. AI가 반영하여 검토드립니다."
                  className="min-h-[100px]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto md:px-8" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '신청 처리 중...' : '무료 분석 신청하기'}
                </Button>
                <p className="text-sm text-muted-foreground mt-3">
                  * 신청 후 24시간 내에 분석 결과를 이메일로 발송해드립니다.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Success Modal */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl">
              신청이 완료되었습니다
            </DialogTitle>
            <DialogDescription className="text-center text-base mt-2">
              행복한 하루 되세요 :)
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <Button onClick={() => setIsSuccessModalOpen(false)} className="px-8">
              확인
            </Button>
          </div>
          <button
            onClick={() => setIsSuccessModalOpen(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">닫기</span>
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}