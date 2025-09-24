import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Upload, FileText, CreditCard, Shield } from 'lucide-react';

interface PaidAnalysisFormProps {
  onBack: () => void;
}

// Helper function to convert file to Base64 (fallback option)
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

export default function PaidAnalysisForm({ onBack }: PaidAnalysisFormProps) {
  const [currentStep, setCurrentStep] = useState<'payment' | 'form'>('payment');
  const [paymentComplete, setPaymentComplete] = useState(false);
  
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

  const handlePayment = () => {
    // 네이버 스마트스토어 결제 API 호출 시뮬레이션
    // 실제로는 window.open이나 iframe을 사용하여 네이버 결제 페이지 연결
    alert('입금 확인을 진행합니다.');
    
    // 결제 완료 시뮬레이션
    setTimeout(() => {
      setPaymentComplete(true);
      setCurrentStep('form');
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Web3Forms API Key
    const apiKey = import.meta.env.VITE_WEB3FORMS_API_KEY;

    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      console.warn('Web3Forms API key not configured. Please set VITE_WEB3FORMS_API_KEY in .env file');
      alert('이메일 서비스가 아직 구성되지 않았습니다. 관리자에게 문의해주세요.');
      return;
    }

    try {
      // Prepare form data for Web3Forms
      const web3FormData = new FormData();
      web3FormData.append('access_key', apiKey);
      web3FormData.append('subject', `[책임 분석 신청] ${formData.name}님 유료 견적 분석 요청`);
      web3FormData.append('name', formData.name);
      web3FormData.append('email', formData.email);
      web3FormData.append('phone', formData.phone);
      web3FormData.append('project_type', getDisplayText(formData.projectType, 'project'));
      web3FormData.append('construction_area', getDisplayText(formData.constructionArea, 'area'));
      web3FormData.append('budget_range', getDisplayText(formData.budgetRange, 'budget'));
      web3FormData.append('additional_info', formData.additionalInfo || '없음');
      web3FormData.append('결제_상태', '결제 완료');
      web3FormData.append('금액', '70,000원');
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
[유료] 책임 분석 신청이 접수되었습니다.

=== 결제 정보 ===
결제 금액: 70,000원
결제 상태: 결제 완료

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

특이사항: 전문가 1:1 분석, 협력사 계약 5% 할인, 견적서 5% 이상 금액 발생 시 100% 부담
처리 요청: 24시간 내 전문가 분석 결과를 고객 이메일(${formData.email})로 발송 예정
신청 일시: ${new Date().toLocaleString('ko-KR')}
      `.trim();

      web3FormData.append('message', message);

      // Send to Web3Forms
      console.log('Sending paid analysis request to Web3Forms...');
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: web3FormData
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Paid analysis email sent successfully via Web3Forms');
        alert('유료 분석 신청이 접수되었습니다. 24시간 내에 전문가 분석 결과를 이메일로 보내드리겠습니다.');

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
    }
  };

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

  const handleFileUpload = (type: 'quote' | 'blueprint', file: File | null) => {
    setFiles(prev => ({ ...prev, [type]: file }));
  };

  if (currentStep === 'payment') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              돌아가기
            </Button>
          </div>

          <div className="text-center mb-8">
            <h1 className="mb-4 text-2xl md:text-3xl">유료 견적 분석 결제</h1>
            <p className="text-muted-foreground">
              전문가의 상세 분석 서비스를 이용하시려면 결제를 진행해 주세요
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                결제 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Service Details */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="mb-3">서비스 상세</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>책임 견적 분석 서비스</span>
                      <span>₩70,000</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>부가세</span>
                      <span>₩0</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>총 결제금액</span>
                      <span>₩70,000</span>
                    </div>
                  </div>
                </div>

                {/* Payment Features */}
                <div className="space-y-3">
                  <h3>포함 서비스</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>전문가 1:1 맞춤 분석</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>상세 분석 리포트 제공</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>협력사 계약 무조건 5% 할인</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>24시간 내 결과 제공</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>견적서 5% 이상 금액 발생 시 저희가 100% 부담</span>
                    </div>
                  </div>
                </div>

                {/* Naver SmartStore Payment */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center p-4 border rounded-lg bg-green-50 border-green-200">
                    <div className="text-center">
                      <div className="text-green-700 mb-2">
                        <svg className="w-8 h-8 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.218 18.682l-1.334-2.725C5.448 14.828 4.465 13.45 4.465 11.987c0-4.142 3.359-7.501 7.501-7.501s7.501 3.359 7.501 7.501c0 1.463-.983 2.841-2.419 3.97l-1.334 2.725H8.218z"/>
                        </svg>
                      </div>
                      <p className="text-sm text-green-700">무통장 안전결제</p>
                      <p className="text-sm text-black-700">우리은행 / 1005-304-766991 / 브이엠에스홀딩스</p>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    size="lg"
                    onClick={handlePayment}
                  >
                    입금 완료
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>입금 완료 버튼을 누르시면 자동으로 분석 신청 페이지로 이동합니다.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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

        {paymentComplete && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <Shield className="w-5 h-5" />
              <span>결제가 완료되었습니다. 이제 분석 신청서를 작성해 주세요.</span>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="mb-4 text-2xl md:text-3xl">유료 견적 분석 신청</h1>
          <p className="text-muted-foreground">
            전문가 분석을 위해 아래 정보를 상세히 입력해 주세요
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
                      <SelectItem value="apartment">아파트 리모델링</SelectItem>
                      <SelectItem value="house">단독주택 건축</SelectItem>
                      <SelectItem value="office">사무실 인테리어</SelectItem>
                      <SelectItem value="commercial">상업시설 건축</SelectItem>
                      <SelectItem value="industrial">공장/창고 건축</SelectItem>
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
                  <Label>견적서 파일 업로드 *</Label>
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
                        required
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
                          {files.blueprint ? files.blueprint.name : 'CAD, PDF, 이미지 파일을 선택하세요'}
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
                <Label htmlFor="additionalInfo">추가 요청사항 및 상세 설명</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                  placeholder="프로젝트에 대한 상세한 설명, 특별히 분석이 필요한 부분, 예산 관련 고민사항 등을 자세히 작성해 주세요. 더 정확한 분석을 위해 가능한 한 구체적으로 작성해 주시면 도움이 됩니다."
                  className="min-h-[120px]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button type="submit" className="w-full md:w-auto md:px-8" size="lg">
                  유료 분석 신청 완료하기
                </Button>
                <p className="text-sm text-muted-foreground mt-3">
                  * 신청 후 1-2일 내에 전문가 분석 결과를 이메일로 발송해드리며, 
                  담당 전문가가 직접 전화 상담을 진행해드립니다. 또한 협력사 및 견적서 금액 보장을 위해 고객님과 협력사 그리고 당사 간 3자 계약을 체결하게 됩니다.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}