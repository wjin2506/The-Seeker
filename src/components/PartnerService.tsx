import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Star, Users, Shield, CheckCircle, Award, Clock, Upload, FileText } from 'lucide-react';

interface PartnerServiceProps {
  onBack: () => void;
}

export default function PartnerService({ onBack }: PartnerServiceProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    constructionArea: '',
    budgetRange: '',
    timeline: '',
    requirements: ''
  });

  const [files, setFiles] = useState({
    quote: null as File | null,
    blueprint: null as File | null
  });

  const handleFileUpload = (type: 'quote' | 'blueprint', file: File | null) => {
    setFiles(prev => ({ ...prev, [type]: file }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.projectType || !formData.constructionArea || !formData.budgetRange) {
      alert('모든 필수 항목(*)을 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);

    // Web3Forms API Key
    const apiKey = import.meta.env.VITE_WEB3FORMS_API_KEY;

    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      console.warn('Web3Forms API key not configured. Please set VITE_WEB3FORMS_API_KEY in .env file');
      alert('이메일 서비스가 아직 구성되지 않았습니다. 관리자에게 문의해주세요.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare form data for Web3Forms
      const web3FormData = new FormData();
      web3FormData.append('access_key', apiKey);
      web3FormData.append('subject', `[협력사 서비스 요청] ${formData.name}님 프로젝트 상담`);
      web3FormData.append('name', formData.name);
      web3FormData.append('email', formData.email);
      web3FormData.append('phone', formData.phone);
      web3FormData.append('company', formData.company || '미입력');
      web3FormData.append('project_type', getDisplayText(formData.projectType, 'project'));
      web3FormData.append('construction_area', getDisplayText(formData.constructionArea, 'area'));
      web3FormData.append('budget_range', getDisplayText(formData.budgetRange, 'budget'));
      web3FormData.append('timeline', getDisplayText(formData.timeline, 'timeline'));
      web3FormData.append('requirements', formData.requirements || '없음');
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
협력사 서비스 요청이 접수되었습니다.

=== 신청자 정보 ===
이름: ${formData.name}
회사명: ${formData.company || '미입력'}
이메일: ${formData.email}
휴대폰: ${formData.phone}

=== 프로젝트 정보 ===
프로젝트 유형: ${getDisplayText(formData.projectType, 'project')}
시공 지역: ${getDisplayText(formData.constructionArea, 'area')}
예산 범위: ${getDisplayText(formData.budgetRange, 'budget')}
희망 시공 시기: ${getDisplayText(formData.timeline, 'timeline')}

=== 첨부 파일 정보 ===
견적서: ${files.quote ? `${files.quote.name} (${Math.round(files.quote.size / 1024)}KB)` : '첨부되지 않음'}
도면: ${files.blueprint ? `${files.blueprint.name} (${Math.round(files.blueprint.size / 1024)}KB)` : '첨부되지 않음'}

=== 추가 요구사항 ===
${formData.requirements || '없음'}

처리 요청: 24시간 내 담당 매니저가 고객(${formData.email})에게 연락 예정
신청 일시: ${new Date().toLocaleString('ko-KR')}
      `.trim();

      web3FormData.append('message', message);

      // Send to Web3Forms
      console.log('Sending partner service request to Web3Forms...');
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: web3FormData
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Partner service email sent successfully via Web3Forms');
        alert('협력사 서비스 요청이 접수되었습니다. 24시간 내에 담당 매니저가 연락드리겠습니다.');

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          projectType: '',
          constructionArea: '',
          budgetRange: '',
          timeline: '',
          requirements: ''
        });
        setFiles({
          quote: null,
          blueprint: null
        });
      } else {
        console.error('Web3Forms error:', result);
        alert('죄송합니다. 요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('죄송합니다. 요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get display text for select values
  const getDisplayText = (value: string, type: 'project' | 'area' | 'budget' | 'timeline'): string => {
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

    const timelines: Record<string, string> = {
      'immediately': '즉시 시작',
      '1-month': '1개월 이내',
      '3-months': '3개월 이내',
      '6-months': '6개월 이내',
      'over-6-months': '6개월 이상'
    };

    switch (type) {
      case 'project': return projectTypes[value] || value;
      case 'area': return areas[value] || value;
      case 'budget': return budgets[value] || value;
      case 'timeline': return timelines[value] || value;
      default: return value;
    }
  };

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
          <h1 className="mb-4 text-3xl md:text-4xl">협력사 서비스</h1>
          <p className="text-muted-foreground text-lg">
            검증된 협력사와 함께 안전하고 투명한 건설 프로젝트를 진행하세요
          </p>
        </div>

        {/* Service Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Shield className="w-12 h-12 text-primary mx-auto mb-2" />
              <CardTitle>검증된 협력사</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                엄격한 심사를 통과한 신뢰할 수 있는 협력사만 선별하여 매칭해드립니다.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Award className="w-12 h-12 text-primary mx-auto mb-2" />
              <CardTitle>전담 매니저</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                프로젝트 시작부터 완료까지 전담 매니저가 관리하여 안전한 진행을 보장합니다.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-2" />
              <CardTitle>투명한 견적</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                숨겨진 비용 없이 투명한 견적서를 제공하며, 단계별 진행 상황을 공유합니다.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Partner Examples */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>협력사 현황</CardTitle>
            <CardDescription>
              다양한 분야의 전문 협력사들이 여러분의 프로젝트를 기다리고 있습니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3>건축 시공</h3>
                <p className="text-sm text-muted-foreground">125개 업체</p>
                <div className="flex justify-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3>인테리어</h3>
                <p className="text-sm text-muted-foreground">89개 업체</p>
                <div className="flex justify-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3>리모델링</h3>
                <p className="text-sm text-muted-foreground">76개 업체</p>
                <div className="flex justify-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3>전문 공사</h3>
                <p className="text-sm text-muted-foreground">152개 업체</p>
                <div className="flex justify-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Request Form */}
        <Card>
          <CardHeader>
            <CardTitle>협력사 서비스 요청</CardTitle>
            <CardDescription>
              프로젝트 정보를 입력해 주시면 최적의 협력사를 매칭해드립니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">담당자명 *</Label>
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

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">연락처 *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="010-1234-5678"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company">회사명</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="(주)회사명"
                  />
                </div>
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
                      <SelectItem value="apartment-remodeling">아파트 리모델링</SelectItem>
                      <SelectItem value="house-construction">단독주택 건축</SelectItem>
                      <SelectItem value="house-remodeling">단독주택 리모델링</SelectItem>
                      <SelectItem value="office-interior">사무실 인테리어</SelectItem>
                      <SelectItem value="commercial-construction">상업시설 건축</SelectItem>
                      <SelectItem value="commercial-interior">상업시설 인테리어</SelectItem>
                      <SelectItem value="industrial-construction">공장/창고 건축</SelectItem>
                      <SelectItem value="specialty-work">전문 공사</SelectItem>
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

              <div className="grid md:grid-cols-2 gap-4">
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

                <div>
                  <Label htmlFor="timeline">희망 시작 시기 *</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, timeline: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="시작 시기 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">즉시</SelectItem>
                      <SelectItem value="1month">1개월 이내</SelectItem>
                      <SelectItem value="3months">3개월 이내</SelectItem>
                      <SelectItem value="6months">6개월 이내</SelectItem>
                      <SelectItem value="1year">1년 이내</SelectItem>
                      <SelectItem value="flexible">유동적</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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

              {/* Project Requirements */}
              <div>
                <Label htmlFor="requirements">프로젝트 상세 요구사항 *</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                  placeholder="프로젝트의 규모, 특별한 요구사항, 선호하는 자재나 공법, 중점적으로 고려해야 할 사항 등을 상세히 작성해 주세요. 더 정확한 협력사 매칭을 위해 구체적으로 설명해 주시면 도움이 됩니다."
                  className="min-h-[120px]"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button type="submit" className="w-full md:w-auto md:px-8" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? '요청 처리 중...' : '협력사 서비스 요청하기'}
                </Button>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>요청 후 24시간 내에 전담 매니저가 연락드려 최적의 협력사를 매칭해드립니다.</span>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Process Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>서비스 진행 과정</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3">
                  1
                </div>
                <h3 className="mb-2">요청 접수</h3>
                <p className="text-sm text-muted-foreground">
                  프로젝트 정보를 기반으로 요청을 접수합니다
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3">
                  2
                </div>
                <h3 className="mb-2">협력사 매칭</h3>
                <p className="text-sm text-muted-foreground">
                  최적의 협력사를 선별하여 매칭합니다
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3">
                  3
                </div>
                <h3 className="mb-2">견적 제공</h3>
                <p className="text-sm text-muted-foreground">
                  투명한 견적서를 제공하고 상담을 진행합니다
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3">
                  4
                </div>
                <h3 className="mb-2">프로젝트 시작</h3>
                <p className="text-sm text-muted-foreground">
                  계약 후 전담 매니저와 함께 프로젝트를 시작합니다
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}