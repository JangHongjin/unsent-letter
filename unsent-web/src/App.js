import React, { useState, useEffect } from 'react';

// 폰트 스타일 정의
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&display=swap');
  body { 
    font-family: 'Nanum Myeongjo', serif; 
    background-color: #fdfcf8; 
  }
`;

export default function App() {
  const [step, setStep] = useState('landing');
  
  // 초기 데이터 상태 (조회수 views 필드 추가)
  const [spaces, setSpaces] = useState(() => {
    const saved = localStorage.getItem('unsent_spaces');
    if (saved) return JSON.parse(saved);
    
    return [
      {
        id: 1,
        name: "첫사랑 그 아이",
        letters: ["복도에서 나던 비누 향기가 가끔 생각나.", "너는 지금쯤 어떤 어른이 되었을까?"],
        views: 0
      },
      {
        id: 2,
        name: "3년 전의 나에게",
        letters: ["지금 고민하는 거, 생각보다 별거 아니게 될 거야.", "조금만 더 버텨줘서 고마워."],
        views: 0
      }
    ];
  });

  const [currentSpace, setCurrentSpace] = useState(null);
  const [newNickname, setNewNickname] = useState('');
  const [content, setContent] = useState('');

  // 데이터 저장
  useEffect(() => {
    localStorage.setItem('unsent_spaces', JSON.stringify(spaces));
  }, [spaces]);

  // 조회수 증가 및 상세 이동 함수
  const handleSpaceClick = (space) => {
    const updatedSpaces = spaces.map(s => 
      s.id === space.id ? { ...s, views: (s.views || 0) + 1 } : s
    );
    setSpaces(updatedSpaces);
    setCurrentSpace(updatedSpaces.find(s => s.id === space.id));
    setStep('main');
  };

  // 랜딩 페이지
  if (step === 'landing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <style>{fontStyles}</style>
        <p className="text-slate-500 text-lg mb-8 leading-relaxed font-light">
          전해지지 못한 진심은 사라지지 않고, 이곳에 잠시 머뭅니다.<br/>
          <span className="text-sm text-slate-400">언젠가 닿을 수도, 혹은 영원히 비밀이 될 수도 있는 마음들.</span>
        </p>
        <button 
          onClick={() => setStep('list')}
          className="px-10 py-3 border border-slate-300 text-slate-600 rounded-full hover:bg-slate-100 transition tracking-widest text-sm"
        >
          서랍 열기
        </button>
      </div>
    );
  }

  // 목록 페이지
  if (step === 'list') {
    return (
      <div className="min-h-screen p-6 max-w-lg mx-auto">
        <style>{fontStyles}</style>
        <h2 className="text-xl text-slate-800 mb-8 font-light">나의 서랍들</h2>
        <div className="grid gap-4 mb-10">
          {spaces.map(s => (
            <div 
              key={s.id} 
              onClick={() => handleSpaceClick(s)}
              className="p-6 border border-slate-100 rounded-2xl bg-white cursor-pointer hover:border-slate-300 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">{s.name}</span>
                <span className="text-[10px] text-slate-300 tracking-tighter">마음이 머문 횟수 {s.views || 0}</span>
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={() => setStep('create')}
          className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl hover:bg-white transition text-sm"
        >
          + 새로운 마음을 둘 곳 추가
        </button>
      </div>
    );
  }

  // 생성 페이지
  if (step === 'create') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <style>{fontStyles}</style>
        <h2 className="text-xl text-slate-700 mb-6 font-light">그 사람을 무엇이라 부를까요?</h2>
        <input 
          type="text"
          className="w-full max-w-sm border-b border-slate-300 py-2 text-center focus:outline-none focus:border-slate-800 mb-10 bg-transparent"
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
          placeholder="별칭 혹은 이름"
        />
        <button 
          onClick={() => {
            if(!newNickname) return;
            const newSpace = { id: Date.now(), name: newNickname, letters: [], views: 0 };
            const updated = [newSpace, ...spaces];
            setSpaces(updated);
            setCurrentSpace(newSpace);
            setNewNickname('');
            setStep('main');
          }}
          className="text-slate-500 hover:text-slate-800 underline underline-offset-8 font-light text-sm"
        >
          이 이름으로 서랍 만들기
        </button>
      </div>
    );
  }
    
  // 상세 작성 및 리스트 페이지 (Main)
  return (
    <div className="min-h-screen p-6 max-w-lg mx-auto">
      <style>{fontStyles}</style>
      <header className="py-10 text-center">
        <span className="text-xs text-slate-400 uppercase tracking-widest font-light">To. {currentSpace.name}</span>
        <h1 className="text-slate-800 mt-2 font-light text-xl">지금의 마음을 담아둡니다</h1>
      </header>
      
      <textarea 
        className="w-full h-64 p-6 bg-white border border-slate-100 rounded-2xl focus:outline-none text-slate-700 leading-relaxed mb-2 shadow-sm resize-none"
        placeholder="지금은 나만 읽고 있지만, 언젠가 그 사람에게 닿을 날을 꿈꿔봅니다."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <p className="text-[11px] text-slate-400 mb-8 pl-2 tracking-tight leading-relaxed">
        * 이 기록은 당신의 브라우저에만 안전하게 보관됩니다.<br/>
        나중에 비밀 질문을 설정해 상대에게만 전달할 수 있습니다.
      </p>

      <div className="flex justify-between items-center mb-12">
        <button onClick={() => setStep('list')} className="text-slate-400 text-sm hover:text-slate-600 transition">목록으로</button>
        <button 
          onClick={() => {
            if(!content) return;
            const updatedSpaces = spaces.map(s => 
              s.id === currentSpace.id ? { ...s, letters: [content, ...s.letters] } : s
            );
            setSpaces(updatedSpaces);
            setCurrentSpace(updatedSpaces.find(s => s.id === currentSpace.id));
            setContent('');
            alert("서랍에 마음을 담았습니다.");
          }}
          className="bg-slate-800 text-white px-10 py-2.5 rounded-full text-sm hover:bg-slate-700 transition shadow-md"
        >
          서랍에 넣어두기
        </button>
      </div>

      <div className="space-y-8 pb-20">
        {currentSpace.letters.map((l, i) => (
          <div key={i} className="text-slate-600 text-sm leading-relaxed border-l border-slate-200 pl-6 py-2 italic font-light">
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}