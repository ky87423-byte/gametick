"use client";

import { useState } from "react";

export function PhoneFarmSimulator() {
  // 상태 관리 (초기값은 첨부 이미지 기준)
  const [sets, setSets] = useState(21);
  const [costPerSet, setCostPerSet] = useState(1700000);
  const [revenuePerSet, setRevenuePerSet] = useState(500000);
  const [devicesPerIp, setDevicesPerIp] = useState(5);
  const [costPerIp, setCostPerIp] = useState(80000);
  const [fixedOpex, setFixedOpex] = useState(1500000);

  // 핵심 지표 계산 로직
  const totalDevices = sets * 20;
  const totalInvestment = sets * costPerSet;

  // IP 개수는 소수점 올림 처리
  const requiredIps = Math.ceil(totalDevices / Math.max(1, devicesPerIp));
  const monthlyProxyCost = requiredIps * costPerIp;

  const totalRevenue = sets * revenuePerSet;
  const totalOpex = monthlyProxyCost + fixedOpex;
  const netProfit = totalRevenue - totalOpex;

  // 회수 불가 시 예외 처리
  const roiMonths = netProfit > 0 ? (totalInvestment / netProfit).toFixed(1) : "회수 불가";

  // 통화 포맷 유틸리티
  const formatKRW = (num: number) => num.toLocaleString("ko-KR");

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white font-sans text-gray-800">
      <h2 className="text-2xl font-bold mb-10 text-gray-900">모바일 폰팜 ROI 시뮬레이터</h2>

      {/* 1. 데이터 테이블 영역 */}
      <div className="mb-12 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300 text-gray-700 text-sm">
              <th className="py-3 px-4 font-semibold w-1/3">지표 항목</th>
              <th className="py-3 px-4 font-semibold w-1/3">수치</th>
              <th className="py-3 px-4 font-semibold w-1/3">산출 기준</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4 text-gray-600">총 보유 기기 수</td>
              <td className="py-3 px-4 font-medium">{totalDevices.toLocaleString()}대</td>
              <td className="py-3 px-4 text-gray-500">세트당 20대 기준</td>
            </tr>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <td className="py-3 px-4 text-gray-600">필요 프록시 IP 개수</td>
              <td className="py-3 px-4 font-medium">{requiredIps.toLocaleString()}개</td>
              <td className="py-3 px-4 text-gray-500">1 IP당 {devicesPerIp}대 분배</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4 text-gray-600">월 프록시 비용</td>
              <td className="py-3 px-4 font-medium">{formatKRW(monthlyProxyCost)}원</td>
              <td className="py-3 px-4 text-gray-500">IP당 {formatKRW(costPerIp)}원</td>
            </tr>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <td className="py-3 px-4 text-gray-600">월 총 지출 (OPEX)</td>
              <td className="py-3 px-4 font-medium">{formatKRW(totalOpex)}원</td>
              <td className="py-3 px-4 text-gray-500">프록시 비용 + 고정비</td>
            </tr>
            {/* 하이라이트 행 */}
            <tr className="bg-blue-200">
              <td className="py-3 px-4 font-medium text-gray-800">투자비 회수 기간</td>
              <td className="py-3 px-4 font-medium text-gray-800">
                {roiMonths}
                {netProfit > 0 ? "개월" : ""}
              </td>
              <td className="py-3 px-4 text-gray-700">초기 투자비 / 월 순수익</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 2. 대시보드 요약 영역 */}
      <div className="flex flex-wrap justify-between items-center mb-12 px-2 py-8 border-t border-b border-gray-200">
        <div className="text-center w-1/4">
          <div className="text-xs text-gray-500 mb-2">총 초기 투자비</div>
          <div className="text-lg md:text-xl font-bold">{formatKRW(totalInvestment)}원</div>
        </div>
        <div className="w-px h-10 bg-gray-300 hidden md:block"></div>
        <div className="text-center w-1/4">
          <div className="text-xs text-gray-500 mb-2">월 총 매출</div>
          <div className="text-lg md:text-xl font-bold">{formatKRW(totalRevenue)}원</div>
        </div>
        <div className="w-px h-10 bg-gray-300 hidden md:block"></div>
        <div className="text-center w-1/4">
          <div className="text-xs text-gray-500 mb-2">월 순수익</div>
          <div className="text-lg md:text-xl font-bold">{formatKRW(netProfit)}원</div>
        </div>
        <div className="w-px h-10 bg-gray-300 hidden md:block"></div>
        <div className="text-center w-1/4">
          <div className="text-xs text-gray-500 mb-2">원금 회수 기간</div>
          <div className="text-lg md:text-xl font-bold">
            {roiMonths}
            {netProfit > 0 ? "개월" : ""}
          </div>
        </div>
      </div>

      {/* 3. 컨트롤 패널 (입력 슬라이더 영역) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
        {/* 세트 수 */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-600 w-1/3">세트 수</label>
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={sets}
            onChange={(e) => setSets(Number(e.target.value))}
            className="w-1/3 mx-4 accent-gray-800"
          />
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(Number(e.target.value))}
            className="w-1/3 bg-gray-100 rounded-md px-3 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* 세트당 투자비 */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-600 w-1/3">세트당 투자비 (원)</label>
          <input
            type="range"
            min="500000"
            max="3000000"
            step="50000"
            value={costPerSet}
            onChange={(e) => setCostPerSet(Number(e.target.value))}
            className="w-1/3 mx-4 accent-gray-800"
          />
          <input
            type="number"
            value={costPerSet}
            onChange={(e) => setCostPerSet(Number(e.target.value))}
            className="w-1/3 bg-gray-100 rounded-md px-3 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* 세트당 월 매출 */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-600 w-1/3">세트당 월 매출 (원)</label>
          <input
            type="range"
            min="100000"
            max="1500000"
            step="50000"
            value={revenuePerSet}
            onChange={(e) => setRevenuePerSet(Number(e.target.value))}
            className="w-1/3 mx-4 accent-gray-800"
          />
          <input
            type="number"
            value={revenuePerSet}
            onChange={(e) => setRevenuePerSet(Number(e.target.value))}
            className="w-1/3 bg-gray-100 rounded-md px-3 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* 1개 IP당 기기 수 */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-600 w-1/3">1개 IP당 기기 수</label>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={devicesPerIp}
            onChange={(e) => setDevicesPerIp(Number(e.target.value))}
            className="w-1/3 mx-4 accent-gray-800"
          />
          <input
            type="number"
            value={devicesPerIp}
            onChange={(e) => setDevicesPerIp(Number(e.target.value))}
            className="w-1/3 bg-gray-100 rounded-md px-3 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* IP당 월 비용 */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-600 w-1/3">IP당 월 비용 (원)</label>
          <input
            type="range"
            min="10000"
            max="150000"
            step="5000"
            value={costPerIp}
            onChange={(e) => setCostPerIp(Number(e.target.value))}
            className="w-1/3 mx-4 accent-gray-800"
          />
          <input
            type="number"
            value={costPerIp}
            onChange={(e) => setCostPerIp(Number(e.target.value))}
            className="w-1/3 bg-gray-100 rounded-md px-3 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* 월 고정비 */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-600 w-1/3">월 고정비 (원)</label>
          <input
            type="range"
            min="500000"
            max="5000000"
            step="100000"
            value={fixedOpex}
            onChange={(e) => setFixedOpex(Number(e.target.value))}
            className="w-1/3 mx-4 accent-gray-800"
          />
          <input
            type="number"
            value={fixedOpex}
            onChange={(e) => setFixedOpex(Number(e.target.value))}
            className="w-1/3 bg-gray-100 rounded-md px-3 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
      </div>
    </div>
  );
}
